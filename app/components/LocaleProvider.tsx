"use client";

import { createContext, useContext } from "react";
import { type Translations, getTranslations } from "@/lib/i18n";

type LocaleContextType = { t: Translations };

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const t = getTranslations("he");
  return <LocaleContext.Provider value={{ t }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
