import { AdminLocaleProvider } from "@/app/components/AdminLocaleProvider";
import AdminNav from "./AdminNav";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLocaleProvider>
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <AdminNav />
        <main className="p-8">{children}</main>
      </div>
    </AdminLocaleProvider>
  );
}
