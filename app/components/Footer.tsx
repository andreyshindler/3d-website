"use client";

import { useLocale } from "@/app/components/LocaleProvider";

export default function Footer() {
  const { t } = useLocale();
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-gray-900 font-semibold">{t.siteName}</p>
        <p className="text-gray-500 text-sm mt-1">{t.footer.tagline}</p>
      </div>
    </footer>
  );
}
