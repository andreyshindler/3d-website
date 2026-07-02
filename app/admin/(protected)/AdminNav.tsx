"use client";

import { useAdminLocale } from "@/app/components/AdminLocaleProvider";

export default function AdminNav() {
  const { t } = useAdminLocale();

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <a href="/admin" className="font-bold text-lg">
        {t.admin.siteName}
      </a>
      <div className="flex items-center gap-6">
        <a
          href="/admin/products"
          className="text-sm hover:text-gray-300 transition-colors"
        >
          {t.admin.products}
        </a>
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            {t.admin.logout}
          </button>
        </form>
      </div>
    </nav>
  );
}
