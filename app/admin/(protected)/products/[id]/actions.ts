"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type UpdateProductState = {
  errors?: {
    name?: string;
    price?: string;
    imageUrl?: string;
    category?: string;
  };
};

export async function updateProduct(
  id: number,
  _prevState: UpdateProductState,
  formData: FormData
): Promise<UpdateProductState> {
  const name = (formData.get("name") as string) ?? "";
  const description = (formData.get("description") as string) ?? "";
  const priceStr = (formData.get("price") as string) ?? "";
  const imageUrl = (formData.get("imageUrl") as string) ?? "";
  const category = (formData.get("category") as string) ?? "";
  const available = formData.get("available") === "on";

  const errors: UpdateProductState["errors"] = {};

  if (!name.trim()) errors.name = "Name is required";
  const price = parseFloat(priceStr);
  if (!priceStr.trim() || isNaN(price) || price < 0)
    errors.price = "A valid price is required";
  if (!imageUrl.trim()) errors.imageUrl = "Image URL is required";
  if (!category.trim()) errors.category = "Category is required";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  await prisma.product.update({
    where: { id },
    data: {
      name: name.trim(),
      description: description.trim(),
      price,
      imageUrl: imageUrl.trim(),
      category: category.trim(),
      available,
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
