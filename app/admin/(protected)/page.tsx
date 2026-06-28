export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Dashboard</h1>
      <a
        href="/admin/products"
        className="inline-block text-blue-600 hover:underline"
      >
        Manage Products →
      </a>
    </div>
  );
}
