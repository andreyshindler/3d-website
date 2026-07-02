"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "@/lib/i18n";

function errs() {
  return getTranslations("he").admin.form.errors;
}

export type UpdateProductState = {
  errors?: {
    name?: string;
    priceIls?: string;
    imageUrl?: string;
    category?: string;
    stock?: string;
  };
};

export async function updateProduct(
  id: number,
  _prevState: UpdateProductState,
  formData: FormData
): Promise<UpdateProductState> {
  const name = (formData.get("name") as string) ?? "";
  const description = (formData.get("description") as string) ?? "";
  const priceIlsStr = (formData.get("priceIls") as string) ?? "";
  const imageUrl = (formData.get("imageUrl") as string) ?? "";
  const category = (formData.get("category") as string) ?? "";
  const available = formData.get("available") === "on";
  const stockStr = (formData.get("stock") as string) ?? "0";

  const errors: UpdateProductState["errors"] = {};

  const e = errs();
  if (!name.trim()) errors.name = e.name;
  const priceIls = parseFloat(priceIlsStr);
  if (!priceIlsStr.trim() || isNaN(priceIls) || priceIls < 0) errors.priceIls = e.priceIls;
  if (!imageUrl.trim()) errors.imageUrl = e.imageUrl;
  if (!category.trim()) errors.category = e.category;
  const stock = parseInt(stockStr, 10);
  if (isNaN(stock) || stock < 0) errors.stock = e.stock;

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  await prisma.product.update({
    where: { id },
    data: {
      name: name.trim(),
      description: description.trim(),
      price: priceIls,
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

export async function deleteProduct(id: number): Promise<void> {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
