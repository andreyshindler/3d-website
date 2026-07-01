"use client";

import { createContext, useContext } from "react";
import { type Locale, type Translations, getTranslations } from "@/lib/i18n";
import { setAdminLocale } from "@/app/actions/adminLocale";

type AdminLocaleContextType = {
  locale: Locale;
  t: Translations;
  toggleLocale: () => Promise<void>;
};

const AdminLocaleContext = createContext<AdminLocaleContextType | null>(null);

export function AdminLocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const t = getTranslations(locale);

  async function toggleLocale() {
    const next: Locale = locale === "he" ? "en" : "he";
    await setAdminLocale(next);
    window.location.reload();
  }

  return (
    <AdminLocaleContext.Provider value={{ locale, t, toggleLocale }}>
      {children}
    </AdminLocaleContext.Provider>
  );
}

export function useAdminLocale() {
  const ctx = useContext(AdminLocaleContext);
  if (!ctx) throw new Error("useAdminLocale must be used within AdminLocaleProvider");
  return ctx;
}
