import { cookies } from "next/headers";
import { type Locale, defaultLocale } from "./i18n";

export function getLocale(): Locale {
  const value = cookies().get("locale")?.value;
  return value === "en" || value === "he" ? value : defaultLocale;
}
