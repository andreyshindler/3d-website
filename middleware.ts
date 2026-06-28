import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_PAYLOAD = "admin-authenticated-v1";
const COOKIE_NAME = "admin_session";

async function computeToken(password: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(SESSION_PAYLOAD));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = request.cookies.get(COOKIE_NAME);
    if (!session?.value) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const expected = await computeToken(process.env.ADMIN_PASSWORD ?? "");
    if (session.value !== expected) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
