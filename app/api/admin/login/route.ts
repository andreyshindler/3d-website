import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const SESSION_PAYLOAD = "admin-authenticated-v1";
const COOKIE_NAME = "admin_session";

function generateToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? "";
  return createHmac("sha256", password).update(SESSION_PAYLOAD).digest("hex");
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get("password") as string;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(
      new URL("/admin/login?error=1", request.url),
      { status: 303 }
    );
  }

  const token = generateToken();
  const response = NextResponse.redirect(
    new URL("/admin/products", request.url),
    { status: 303 }
  );
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
