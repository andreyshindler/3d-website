import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditProductForm } from "./EditProductForm";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return <EditProductForm product={product} />;
}
