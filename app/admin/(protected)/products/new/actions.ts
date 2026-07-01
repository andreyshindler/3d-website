"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getTranslations, type Locale } from "@/lib/i18n";
import { cookies } from "next/headers";

function errs() {
  const locale = (cookies().get("admin_locale")?.value ?? "he") as Locale;
  return getTranslations(locale).admin.form.errors;
}

export type CreateProductState = {
  errors?: {
    name?: string;
    priceUsd?: string;
    priceIls?: string;
    imageUrl?: string;
    category?: string;
    stock?: string;
  };
};

export async function createProduct(
  _prevState: CreateProductState,
  formData: FormData
): Promise<CreateProductState> {
  const name = (formData.get("name") as string) ?? "";
  const nameEn = (formData.get("nameEn") as string) ?? "";
  const description = (formData.get("description") as string) ?? "";
  const descriptionEn = (formData.get("descriptionEn") as string) ?? "";
  const priceUsdStr = (formData.get("priceUsd") as string) ?? "";
  const priceIlsStr = (formData.get("priceIls") as string) ?? "";
  const imageUrl = (formData.get("imageUrl") as string) ?? "";
  const category = (formData.get("category") as string) ?? "";
  const available = formData.get("available") === "on";
  const stockStr = (formData.get("stock") as string) ?? "0";

  const errors: CreateProductState["errors"] = {};

  const e = errs();
  if (!name.trim()) errors.name = e.name;
  const priceUsd = parseFloat(priceUsdStr);
  if (!priceUsdStr.trim() || isNaN(priceUsd) || priceUsd < 0) errors.priceUsd = e.priceUsd;
  const priceIls = parseFloat(priceIlsStr);
  if (!priceIlsStr.trim() || isNaN(priceIls) || priceIls < 0) errors.priceIls = e.priceIls;
  if (!imageUrl.trim()) errors.imageUrl = e.imageUrl;
  if (!category.trim()) errors.category = e.category;
  const stock = parseInt(stockStr, 10);
  if (isNaN(stock) || stock < 0) errors.stock = e.stock;

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  await prisma.product.create({
    data: {
      name: name.trim(),
      nameEn: nameEn.trim(),
      description: description.trim(),
      descriptionEn: descriptionEn.trim(),
      price: priceUsd,
      priceIls,
      imageUrl: imageUrl.trim(),
      category: category.trim(),
      available,
      stock,
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}
