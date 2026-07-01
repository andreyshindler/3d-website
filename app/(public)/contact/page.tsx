import ContactForm from "./ContactForm";
import { getLocale } from "@/lib/locale";
import { getTranslations } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: { product?: string; productId?: string };
}) {
  const locale = getLocale();
  const t = getTranslations(locale);

  let defaultProduct = searchParams.product ?? "";
  let defaultProductId = "";

  if (searchParams.productId) {
    const id = parseInt(searchParams.productId, 10);
    if (!isNaN(id)) {
      const found = await prisma.product.findUnique({
        where: { id },
        select: { id: true, name: true, nameEn: true },
      });
      if (found) {
        defaultProductId = String(found.id);
        defaultProduct = locale === "en" && found.nameEn ? found.nameEn : found.name;
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.contact.title}</h1>
      <p className="text-gray-600 mb-8">{t.contact.subtitle}</p>
      <ContactForm defaultProduct={defaultProduct} defaultProductId={defaultProductId} />
    </div>
  );
}
