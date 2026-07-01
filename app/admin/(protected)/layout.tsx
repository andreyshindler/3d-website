import { AdminLocaleProvider } from "@/app/components/AdminLocaleProvider";
import { getAdminLocale } from "@/lib/adminLocale";
import AdminNav from "./AdminNav";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminLocale = getAdminLocale();

  return (
    <AdminLocaleProvider locale={adminLocale}>
      <div
        className="min-h-screen bg-gray-50"
        dir={adminLocale === "he" ? "rtl" : "ltr"}
      >
        <AdminNav />
        <main className="p-8">{children}</main>
      </div>
    </AdminLocaleProvider>
  );
}
