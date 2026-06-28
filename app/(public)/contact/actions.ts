"use server";

import nodemailer from "nodemailer";

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

export async function submitContactForm(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = (formData.get("name") as string) ?? "";
  const email = (formData.get("email") as string) ?? "";
  const product = (formData.get("product") as string) ?? "";
  const message = (formData.get("message") as string) ?? "";

  const errors: ContactState["errors"] = {};

  if (!name.trim()) errors.name = "Name is required";
  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Enter a valid email address";
  }
  if (!product.trim()) errors.product = "Product of interest is required";
  if (!message.trim()) errors.message = "Message is required";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const contactEmail = process.env.CONTACT_EMAIL;
  if (!contactEmail) {
    return { status: "error", errorMessage: "Server configuration error: missing CONTACT_EMAIL." };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT ?? "587", 10),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"3D Prints Shop" <${process.env.SMTP_USER}>`,
      to: contactEmail,
      replyTo: email.trim(),
      subject: `Order Inquiry: ${product.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nProduct: ${product.trim()}\n\n${message.trim()}`,
      html: `
        <p><strong>Name:</strong> ${name.trim()}</p>
        <p><strong>Email:</strong> ${email.trim()}</p>
        <p><strong>Product of interest:</strong> ${product.trim()}</p>
        <hr />
        <p>${message.trim().replace(/\n/g, "<br>")}</p>
      `,
    });

    return { status: "success" };
  } catch {
    return { status: "error", errorMessage: "Failed to send your message. Please try again later." };
  }
}
