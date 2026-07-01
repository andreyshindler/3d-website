import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/locale";
import { getTranslations } from "@/lib/i18n";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const locale = getLocale();
  const t = getTranslations(locale);
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const product = await prisma.product.findFirst({
    where: { id, available: true },
  });

  if (!product) notFound();

  const displayName =
    locale === "en" && product.nameEn ? product.nameEn : product.name;
  const displayDescription =
    locale === "en" && product.descriptionEn
      ? product.descriptionEn
      : product.description;
  const displayCategory = t.catalog.categoryLabel(product.category);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/catalog"
        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-8"
      >
        {t.product.backToCatalog}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-start">
          <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
            {displayCategory}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{displayName}</h1>
          <p className="mt-3 text-2xl font-semibold text-gray-800">
            {t.formatPrice(locale === "he" ? product.priceIls : product.price)}
          </p>

          {displayDescription && (
            <p className="mt-5 text-gray-600 leading-relaxed">{displayDescription}</p>
          )}

          <p className="mt-4">
            <span
              className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
                product.stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {product.stock > 0 ? t.product.inStock(product.stock) : t.product.outOfStock}
            </span>
          </p>

          <Link
            href={`/contact?productId=${product.id}`}
            className="mt-8 inline-block text-center bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {t.product.requestOrder}
          </Link>
        </div>
      </div>
    </div>
  );
}
