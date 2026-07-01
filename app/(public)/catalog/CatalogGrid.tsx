"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProductModel } from "@/app/generated/prisma/models";
import { useLocale } from "@/app/components/LocaleProvider";

const ALL = "__all__";

export default function CatalogGrid({
  products,
}: {
  products: ProductModel[];
}) {
  const { t, locale } = useLocale();
  const categories = Array.from(new Set(products.map((p) => p.category))).sort();
  const [selected, setSelected] = useState(ALL);

  const categoryDisplay = Object.fromEntries(
    products.map((p) => [p.category, locale === "en" && p.categoryEn ? p.categoryEn : p.category])
  );

  const filtered =
    selected === ALL ? products : products.filter((p) => p.category === selected);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelected(ALL)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === ALL
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {t.catalog.all}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selected === cat
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {categoryDisplay[cat]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-20">{t.catalog.noProducts}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/catalog/${product.id}`}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
                  {categoryDisplay[product.category]}
                </span>
                <h3 className="mt-1 text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {locale === "en" && product.nameEn ? product.nameEn : product.name}
                </h3>
                <p className="mt-1 text-lg font-bold text-gray-800">
                  {t.formatPrice(locale === "he" ? product.priceIls : product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
