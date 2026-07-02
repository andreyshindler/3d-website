import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ADMIN_CHAT = process.env.TELEGRAM_CHAT_ID!;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET ?? "";
const BUCKET = "product-images";
const PAGE_SIZE = 8;

// ─── Telegram API ──────────────────────────────────────────────────────────────

async function tg(method: string, body: object) {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json() as Promise<{ ok: boolean; result: unknown }>;
}

function send(chatId: string | number, text: string, extra?: object) {
  return tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", ...extra });
}

function editMsg(chatId: string | number, messageId: number, text: string, extra?: object) {
  return tg("editMessageText", {
    chat_id: chatId, message_id: messageId, text, parse_mode: "HTML", ...extra,
  });
}

function answerCb(id: string, text?: string) {
  return tg("answerCallbackQuery", { callback_query_id: id, text });
}

function btn(text: string, data: string) {
  return { text, callback_data: data };
}

const mainKeyboard = {
  keyboard: [[{ text: "📦 רשימת מוצרים" }], [{ text: "➕ הוסף מוצר חדש" }]],
  resize_keyboard: true,
  persistent: true,
};

// ─── Session ───────────────────────────────────────────────────────────────────

async function getSession(chatId: string) {
  return prisma.botSession.upsert({
    where: { chatId },
    create: { chatId },
    update: {},
  });
}

async function setSession(chatId: string, step: string, data: Record<string, unknown> = {}) {
  await prisma.botSession.upsert({
    where: { chatId },
    create: { chatId, step, data: JSON.stringify(data) },
    update: { step, data: JSON.stringify(data) },
  });
}

async function clearSession(chatId: string) {
  await prisma.botSession.upsert({
    where: { chatId },
    create: { chatId },
    update: { step: "idle", data: "{}" },
  });
}

// ─── Image upload ──────────────────────────────────────────────────────────────

async function uploadTelegramPhoto(fileId: string): Promise<string | null> {
  const res = await tg("getFile", { file_id: fileId });
  if (!res.ok) return null;
  const filePath = (res.result as { file_path: string }).file_path;
  const fileUrl = `https://api.telegram.org/file/bot${TOKEN}/${filePath}`;

  const fileRes = await fetch(fileUrl);
  if (!fileRes.ok) return null;

  const buffer = Buffer.from(await fileRes.arrayBuffer());
  const ext = filePath.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-bot-${Math.random().toString(36).slice(2)}.${ext}`;
  const contentType = `image/${ext === "jpg" ? "jpeg" : ext}`;

  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { error } = await sb.storage.from(BUCKET).upload(filename, buffer, { contentType, upsert: false });
  if (error) return null;

  const { data } = sb.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

// ─── UI helpers ────────────────────────────────────────────────────────────────

async function showProductList(chatId: string | number, page = 0) {
  const all = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  if (all.length === 0) {
    await send(chatId, "אין מוצרים.\n/add להוסיף מוצר חדש.");
    return;
  }

  const start = page * PAGE_SIZE;
  const slice = all.slice(start, start + PAGE_SIZE);
  const total = all.length;

  let text = `<b>📦 מוצרים (${total})</b>\n\n`;
  const rows: Array<Array<{ text: string; callback_data: string }>> = [];

  slice.forEach((p, i) => {
    text += `${start + i + 1}. ${p.available ? "✅" : "❌"} <b>${p.name}</b> — ₪${p.priceIls}\n`;
    rows.push([btn(`✏️ ${p.name}`, `view:${p.id}`)]);
  });

  const nav: Array<{ text: string; callback_data: string }> = [];
  if (page > 0) nav.push(btn("◀️ הקודם", `list:${page - 1}`));
  if (start + PAGE_SIZE < total) nav.push(btn("הבא ▶️", `list:${page + 1}`));
  if (nav.length > 0) rows.push(nav);
  rows.push([btn("➕ הוסף מוצר", "startadd")]);

  await send(chatId, text, { reply_markup: { inline_keyboard: rows } });
}

async function showProduct(chatId: string | number, msgId: number, productId: number) {
  const p = await prisma.product.findUnique({ where: { id: productId } });
  if (!p) {
    await send(chatId, "מוצר לא נמצא.");
    return;
  }

  const text =
    `<b>${p.name}</b>\n` +
    `קטגוריה: ${p.category}\n` +
    `מחיר: ₪${p.priceIls}\n` +
    `מלאי: ${p.stock}\n` +
    `זמין: ${p.available ? "✅ כן" : "❌ לא"}` +
    (p.description ? `\n\n${p.description}` : "");

  await editMsg(chatId, msgId, text, {
    reply_markup: {
      inline_keyboard: [
        [btn("✏️ ערוך", `edit:${p.id}`), btn("🗑 מחק", `del:${p.id}`)],
        [btn(p.available ? "❌ הסתר" : "✅ הצג", `tog:${p.id}`)],
        [btn("↩️ חזור לרשימה", "list:0")],
      ],
    },
  });
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (WEBHOOK_SECRET) {
    const secret = req.headers.get("x-telegram-bot-api-secret-token");
    if (secret !== WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
  }

  const update = await req.json() as {
    callback_query?: {
      id: string;
      data: string;
      message: { chat: { id: number }; message_id: number };
    };
    message?: {
      chat: { id: number };
      text?: string;
      photo?: Array<{ file_id: string }>;
    };
  };

  // ── Callback queries ─────────────────────────────────────────────────────────
  if (update.callback_query) {
    const cq = update.callback_query;
    const chatId = String(cq.message.chat.id);
    const msgId = cq.message.message_id;
    const data = cq.data;

    if (chatId !== ADMIN_CHAT) {
      await answerCb(cq.id, "Unauthorized");
      return NextResponse.json({ ok: true });
    }

    await answerCb(cq.id);

    if (data.startsWith("list:")) {
      const page = parseInt(data.split(":")[1], 10);
      await tg("deleteMessage", { chat_id: chatId, message_id: msgId });
      await showProductList(chatId, page);

    } else if (data.startsWith("view:")) {
      await showProduct(chatId, msgId, parseInt(data.split(":")[1], 10));

    } else if (data === "startadd") {
      await clearSession(chatId);
      await setSession(chatId, "add:name");
      await tg("deleteMessage", { chat_id: chatId, message_id: msgId });
      await send(chatId, "➕ <b>מוצר חדש</b>\n\nהזן שם מוצר:\n/cancel לביטול", {
        reply_markup: { force_reply: true },
      });

    } else if (data.startsWith("del:")) {
      const id = parseInt(data.split(":")[1], 10);
      const p = await prisma.product.findUnique({ where: { id } });
      if (!p) return NextResponse.json({ ok: true });
      await editMsg(chatId, msgId, `🗑 למחוק את <b>${p.name}</b>?`, {
        reply_markup: {
          inline_keyboard: [
            [btn("✅ כן, מחק", `delok:${id}`), btn("❌ ביטול", `view:${id}`)],
          ],
        },
      });

    } else if (data.startsWith("delok:")) {
      const id = parseInt(data.split(":")[1], 10);
      await prisma.product.delete({ where: { id } });
      revalidatePath("/catalog");
      await editMsg(chatId, msgId, "✅ המוצר נמחק.", {
        reply_markup: { inline_keyboard: [[btn("↩️ לרשימה", "list:0")]] },
      });

    } else if (data.startsWith("tog:")) {
      const id = parseInt(data.split(":")[1], 10);
      const p = await prisma.product.findUnique({ where: { id } });
      if (!p) return NextResponse.json({ ok: true });
      await prisma.product.update({ where: { id }, data: { available: !p.available } });
      revalidatePath("/catalog");
      await showProduct(chatId, msgId, id);

    } else if (data.startsWith("edit:") && data.split(":").length === 2) {
      const id = parseInt(data.split(":")[1], 10);
      const p = await prisma.product.findUnique({ where: { id } });
      if (!p) return NextResponse.json({ ok: true });
      await editMsg(chatId, msgId, `✏️ <b>עריכת ${p.name}</b>\n\nמה לערוך?`, {
        reply_markup: {
          inline_keyboard: [
            [btn("שם", `editf:${id}:name`), btn("קטגוריה", `editf:${id}:category`)],
            [btn("מחיר ₪", `editf:${id}:price`), btn("תיאור", `editf:${id}:desc`)],
            [btn("תמונה", `editf:${id}:image`), btn("מלאי", `editf:${id}:stock`)],
            [btn("↩️ חזור", `view:${id}`)],
          ],
        },
      });

    } else if (data.startsWith("editf:")) {
      const [, idStr, field] = data.split(":");
      const id = parseInt(idStr, 10);
      const p = await prisma.product.findUnique({ where: { id } });
      if (!p) return NextResponse.json({ ok: true });

      const labels: Record<string, string> = {
        name: "שם", category: "קטגוריה", price: "מחיר (₪)",
        desc: "תיאור", image: "תמונה — שלח URL או תמונה", stock: "מלאי",
      };
      const currents: Record<string, string | number> = {
        name: p.name, category: p.category, price: p.priceIls,
        desc: p.description, image: p.imageUrl, stock: p.stock,
      };

      await setSession(chatId, `edit:${id}:${field}`);
      await tg("deleteMessage", { chat_id: chatId, message_id: msgId });
      await send(
        chatId,
        `✏️ <b>${labels[field]}</b>\n\nנוכחי: ${currents[field]}\n\nהזן ערך חדש:\n/cancel לביטול`,
        { reply_markup: { force_reply: true } }
      );
    }

    return NextResponse.json({ ok: true });
  }

  // ── Text / photo messages ────────────────────────────────────────────────────
  if (update.message) {
    const msg = update.message;
    const chatId = String(msg.chat.id);
    const text = msg.text ?? "";
    const photo = msg.photo;

    if (chatId !== ADMIN_CHAT) return NextResponse.json({ ok: true });

    // Built-in commands
    if (text === "/start" || text === "/help") {
      await clearSession(chatId);
      await send(chatId, "🖨 <b>ניהול מוצרים</b>", {
        reply_markup: {
          keyboard: [
            [{ text: "📦 רשימת מוצרים" }],
            [{ text: "➕ הוסף מוצר חדש" }],
          ],
          resize_keyboard: true,
          persistent: true,
        },
      });
      return NextResponse.json({ ok: true });
    }

    if (text === "📦 רשימת מוצרים") {
      await clearSession(chatId);
      await showProductList(chatId, 0);
      return NextResponse.json({ ok: true });
    }

    if (text === "➕ הוסף מוצר חדש") {
      await setSession(chatId, "add:name");
      await send(chatId, "➕ <b>מוצר חדש</b>\n\nהזן שם מוצר:\n/cancel לביטול", {
        reply_markup: { force_reply: true },
      });
      return NextResponse.json({ ok: true });
    }

    if (text === "/products") {
      await clearSession(chatId);
      await showProductList(chatId, 0);
      return NextResponse.json({ ok: true });
    }

    if (text === "/add") {
      await setSession(chatId, "add:name");
      await send(chatId, "➕ <b>מוצר חדש</b>\n\nהזן שם מוצר:\n/cancel לביטול", {
        reply_markup: { force_reply: true },
      });
      return NextResponse.json({ ok: true });
    }

    if (text === "/cancel") {
      await clearSession(chatId);
      await send(chatId, "❌ הפעולה בוטלה.", { reply_markup: mainKeyboard });
      return NextResponse.json({ ok: true });
    }

    const session = await getSession(chatId);
    const step = session.step;
    const sd = JSON.parse(session.data || "{}") as Record<string, unknown>;

    if (step === "idle") {
      await send(chatId, "/help לרשימת פקודות.");
      return NextResponse.json({ ok: true });
    }

    // ── Add product flow ───────────────────────────────────────────────────────
    if (step === "add:name") {
      if (!text.trim()) { await send(chatId, "⚠️ שם ריק. נסה שוב:"); return NextResponse.json({ ok: true }); }
      await setSession(chatId, "add:category", { ...sd, name: text.trim() });
      await send(chatId, "הזן קטגוריה:", { reply_markup: { force_reply: true } });
      return NextResponse.json({ ok: true });
    }

    if (step === "add:category") {
      if (!text.trim()) { await send(chatId, "⚠️ קטגוריה ריקה. נסה שוב:"); return NextResponse.json({ ok: true }); }
      await setSession(chatId, "add:price", { ...sd, category: text.trim() });
      await send(chatId, "הזן מחיר בשקלים (₪):", { reply_markup: { force_reply: true } });
      return NextResponse.json({ ok: true });
    }

    if (step === "add:price") {
      const v = parseFloat(text.trim());
      if (isNaN(v) || v < 0) { await send(chatId, "⚠️ מחיר לא תקין. הזן מספר:"); return NextResponse.json({ ok: true }); }
      await setSession(chatId, "add:desc", { ...sd, price: v });
      await send(chatId, "הזן תיאור (או שלח - לדלג):", { reply_markup: { force_reply: true } });
      return NextResponse.json({ ok: true });
    }

    if (step === "add:desc") {
      const desc = text.trim() === "-" ? "" : text.trim();
      await setSession(chatId, "add:image", { ...sd, desc });
      await send(chatId, "שלח תמונה או הזן URL:", { reply_markup: { force_reply: true } });
      return NextResponse.json({ ok: true });
    }

    if (step === "add:image") {
      let imageUrl = "";
      if (photo) {
        const fileId = photo[photo.length - 1].file_id;
        imageUrl = (await uploadTelegramPhoto(fileId)) ?? "";
      } else if (text.startsWith("http")) {
        imageUrl = text.trim();
      }
      if (!imageUrl) { await send(chatId, "⚠️ שגיאה. שלח URL תקין או תמונה:"); return NextResponse.json({ ok: true }); }
      await setSession(chatId, "add:stock", { ...sd, imageUrl });
      await send(chatId, "הזן כמות במלאי:", { reply_markup: { force_reply: true } });
      return NextResponse.json({ ok: true });
    }

    if (step === "add:stock") {
      const stock = parseInt(text.trim(), 10);
      if (isNaN(stock) || stock < 0) { await send(chatId, "⚠️ כמות לא תקינה. הזן מספר שלם:"); return NextResponse.json({ ok: true }); }
      const priceIls = Number(sd.price);
      await prisma.product.create({
        data: {
          name: String(sd.name),
          description: String(sd.desc ?? ""),
          price: priceIls,
          priceIls,
          imageUrl: String(sd.imageUrl),
          category: String(sd.category),
          available: true,
          stock,
        },
      });
      revalidatePath("/catalog");
      await clearSession(chatId);
      await send(chatId, `✅ <b>${sd.name}</b> נוסף!`, { reply_markup: mainKeyboard });
      return NextResponse.json({ ok: true });
    }

    // ── Edit product flow ──────────────────────────────────────────────────────
    if (step.startsWith("edit:")) {
      const [, idStr, field] = step.split(":");
      const id = parseInt(idStr, 10);

      let value: string | number = text.trim();

      if (field === "price") {
        const v = parseFloat(text.trim());
        if (isNaN(v) || v < 0) { await send(chatId, "⚠️ מחיר לא תקין:"); return NextResponse.json({ ok: true }); }
        value = v;
      } else if (field === "stock") {
        const v = parseInt(text.trim(), 10);
        if (isNaN(v) || v < 0) { await send(chatId, "⚠️ כמות לא תקינה:"); return NextResponse.json({ ok: true }); }
        value = v;
      } else if (field === "image") {
        if (photo) {
          const fileId = photo[photo.length - 1].file_id;
          const url = await uploadTelegramPhoto(fileId);
          if (!url) { await send(chatId, "⚠️ שגיאה בהעלאה. נסה שוב:"); return NextResponse.json({ ok: true }); }
          value = url;
        } else if (!text.startsWith("http")) {
          await send(chatId, "⚠️ שלח URL תקין או תמונה:");
          return NextResponse.json({ ok: true });
        }
      } else if (!String(value)) {
        await send(chatId, "⚠️ הערך לא יכול להיות ריק:");
        return NextResponse.json({ ok: true });
      }

      const fieldMap: Record<string, object> = {
        name: { name: value },
        category: { category: value },
        price: { price: value, priceIls: value },
        desc: { description: value },
        image: { imageUrl: value },
        stock: { stock: value },
      };

      await prisma.product.update({ where: { id }, data: fieldMap[field] });
      revalidatePath("/catalog");
      revalidatePath(`/catalog/${id}`);
      await clearSession(chatId);
      await send(chatId, "✅ עודכן!", { reply_markup: mainKeyboard });
      return NextResponse.json({ ok: true });
    }
  }

  return NextResponse.json({ ok: true });
}
