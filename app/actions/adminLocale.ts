"use server";

import { cookies } from "next/headers";
import { type Locale } from "@/lib/i18n";

export async function setAdminLocale(locale: Locale) {
  cookies().set("admin_locale", locale, {
    path: "/admin",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "strict",
    httpOnly: false,
  });
}
