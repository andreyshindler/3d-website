import { prisma } from "@/lib/prisma";
import CatalogGrid from "./CatalogGrid";
import { getLocale } from "@/lib/locale";
import { getTranslations } from "@/lib/i18n";

export default async function CatalogPage() {
  const t = getTranslations(getLocale());
  const products = await prisma.product.findMany({
    where: { available: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.catalog.title}</h1>
      <p className="text-gray-600 mb-8">{t.catalog.subtitle}</p>
      <CatalogGrid products={products} />
    </div>
  );
}
