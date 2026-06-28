import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const product = await prisma.product.findFirst({
    where: { id, available: true },
  });

  if (!product) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/catalog"
        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-8"
      >
        &larr; Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-start">
          <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
            {product.category}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-gray-800">
            ${product.price.toFixed(2)}
          </p>

          {product.description && (
            <p className="mt-5 text-gray-600 leading-relaxed">{product.description}</p>
          )}

          <Link
            href={`/contact?product=${encodeURIComponent(product.name)}`}
            className="mt-8 inline-block text-center bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Request Order
          </Link>
        </div>
      </div>
    </div>
  );
}
