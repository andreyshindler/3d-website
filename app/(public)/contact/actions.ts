"use server";

import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export type ContactState = {
  status?: "success" | "error";
  errorMessage?: string;
  errors?: {
    name?: string;
    email?: string;
    product?: string;
    message?: string;
  };
};

async function sendTelegram(
  name: string,
  email: string,
  product: string,
  message: string,
  productUrl: string | null
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const productLine = productUrl
    ? `🖨️ <b>מוצר:</b> <a href="${productUrl}">${product}</a>`
    : `🖨️ <b>מוצר:</b> ${product}`;

  const now = new Date();
  const timestamp = now.toLocaleString("he-IL", {
    timeZone: "Asia/Jerusalem",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const text =
    `📩 <b>פנייה חדשה מהאתר</b>\n` +
    `🕐 ${timestamp}\n\n` +
    `👤 <b>שם:</b> ${name}\n` +
    `📧 <b>אימייל:</b> ${email}\n` +
    `${productLine}\n\n` +
    `💬 <b>הודעה:</b>\n${message}`;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      }
    );
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}

async function sendEmail(
  name: string,
  email: string,
  product: string,
  message: string
): Promise<boolean> {
  const contactEmail = process.env.CONTACT_EMAIL;
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!contactEmail || !smtpHost || !smtpUser || !smtpPass) return false;

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT ?? "587", 10),
      secure: process.env.SMTP_PORT === "465",
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"3D Prints Shop" <${smtpUser}>`,
      to: contactEmail,
      replyTo: email,
      subject: `Order Inquiry: ${product}`,
      text: `Name: ${name}\nEmail: ${email}\nProduct: ${product}\n\n${message}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Product of interest:</strong> ${product}</p>
        <hr />
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });
    return true;
  } catch {
    return false;
  }
}

export async function submitContactForm(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = ((formData.get("name") as string) ?? "").trim();
  const email = ((formData.get("email") as string) ?? "").trim();
  const product = ((formData.get("product") as string) ?? "").trim();
  const message = ((formData.get("message") as string) ?? "").trim();

  const errors: ContactState["errors"] = {};
  if (!name) errors.name = "Name is required";
  if (!email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }
  if (!product) errors.product = "Product of interest is required";
  if (!message) errors.message = "Message is required";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const productIdRaw = (formData.get("productId") as string) ?? "";
  const productId = parseInt(productIdRaw, 10);
  let found: { id: number } | null = null;
  if (!isNaN(productId)) {
    found = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  } else {
    found = await prisma.product.findFirst({
      where: { OR: [{ name: product }, { nameEn: product }] },
      select: { id: true },
    });
  }
  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
  const productUrl = found ? `${siteUrl}/catalog/${found.id}` : null;

  const [telegramOk, emailOk] = await Promise.all([
    sendTelegram(name, email, product, message, productUrl),
    sendEmail(name, email, product, message),
  ]);

  if (!telegramOk && !emailOk) {
    return {
      status: "error",
      errorMessage:
        "Failed to send your message. Please try again later.",
    };
  }

  return { status: "success" };
}
