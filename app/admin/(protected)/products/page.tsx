import { prisma } from "@/lib/prisma";
import { deleteProduct } from "./[id]/actions";
import { DeleteButton } from "./DeleteButton";
import { getAdminLocale } from "@/lib/adminLocale";
import { getTranslations } from "@/lib/i18n";

export default async function AdminProductsPage() {
  const locale = getAdminLocale();
  const t = getTranslations(locale);
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.admin.products}</h1>
        <a
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {t.admin.addProduct}
        </a>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">{t.admin.noProducts}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-start">{t.admin.table.name}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.category}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.price}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.stock}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.available}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {locale === "en" && product.nameEn ? product.nameEn : product.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.category}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {t.formatPrice(locale === "he" ? product.priceIls : product.price)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 0
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.available
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.available ? t.admin.table.yes : t.admin.table.no}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 items-center">
                      <a
                        href={`/admin/products/${product.id}/edit`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {t.admin.table.edit}
                      </a>
                      <span className="text-gray-300">|</span>
                      <DeleteButton
                        deleteAction={deleteProduct.bind(null, product.id)}
                        label={t.admin.table.delete}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
