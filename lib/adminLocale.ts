import { cookies } from "next/headers";
import { type Locale, defaultLocale } from "./i18n";

export function getAdminLocale(): Locale {
  const value = cookies().get("admin_locale")?.value;
  return value === "en" || value === "he" ? value : defaultLocale;
}
