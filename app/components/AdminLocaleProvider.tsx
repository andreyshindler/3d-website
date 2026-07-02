"use client";

import { createContext, useContext } from "react";
import { type Translations, getTranslations } from "@/lib/i18n";

type AdminLocaleContextType = { t: Translations };

const AdminLocaleContext = createContext<AdminLocaleContextType | null>(null);

export function AdminLocaleProvider({ children }: { children: React.ReactNode }) {
  const t = getTranslations("he");
  return <AdminLocaleContext.Provider value={{ t }}>{children}</AdminLocaleContext.Provider>;
}

export function useAdminLocale() {
  const ctx = useContext(AdminLocaleContext);
  if (!ctx) throw new Error("useAdminLocale must be used within AdminLocaleProvider");
  return ctx;
}
