export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <a href="/admin" className="font-bold text-lg">
          3D Prints Admin
        </a>
        <div className="flex items-center gap-6">
          <a
            href="/admin/products"
            className="text-sm hover:text-gray-300 transition-colors"
          >
            Products
          </a>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </nav>
      <main className="p-8">{children}</main>
    </div>
  );
}
