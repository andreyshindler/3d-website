"use client";

import { createContext, useContext } from "react";
import { type Locale, type Translations, getTranslations } from "@/lib/i18n";
import { setLocale } from "@/app/actions/locale";

type LocaleContextType = {
  locale: Locale;
  t: Translations;
  toggleLocale: () => Promise<void>;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const t = getTranslations(locale);

  async function toggleLocale() {
    const next: Locale = locale === "he" ? "en" : "he";
    await setLocale(next);
    window.location.reload();
  }

  return (
    <LocaleContext.Provider value={{ locale, t, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
