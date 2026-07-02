"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateProduct, type UpdateProductState } from "../actions";
import type { ProductModel } from "@/app/generated/prisma/models";
import { useAdminLocale } from "@/app/components/AdminLocaleProvider";
import { ImageUploadField } from "@/app/components/ImageUploadField";

const initialState: UpdateProductState = {};

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function EditProductForm({ product }: { product: ProductModel }) {
  const { t } = useAdminLocale();
  const a = t.admin;
  const updateWithId = updateProduct.bind(null, product.id);
  const [state, formAction] = useFormState(updateWithId, initialState);

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <a href="/admin/products" className="text-gray-500 hover:text-gray-700 text-sm">
          {a.backToProducts}
        </a>
        <h1 className="text-2xl font-bold text-gray-900">{a.editProduct}</h1>
      </div>

      <form action={formAction} className="space-y-5 bg-white p-6 rounded-lg border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
            {a.form.name} <span className="text-red-500">*</span>
          </label>
          <input id="name" name="name" type="text" defaultValue={product.name}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${state.errors?.name ? "border-red-400" : "border-gray-300"}`}
          />
          {state.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
            {a.form.description}
          </label>
          <textarea id="description" name="description" rows={3} defaultValue={product.description}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="priceIls">
            {a.form.priceIls} <span className="text-red-500">*</span>
          </label>
          <input id="priceIls" name="priceIls" type="number" step="0.01" min="0" defaultValue={product.priceIls}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${state.errors?.priceIls ? "border-red-400" : "border-gray-300"}`}
          />
          {state.errors?.priceIls && <p className="text-red-500 text-xs mt-1">{state.errors.priceIls}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {a.form.imageUrl} <span className="text-red-500">*</span>
          </label>
          <ImageUploadField
            defaultValue={product.imageUrl}
            uploadLabel={a.form.uploadPhoto}
            errorMsg={state.errors?.imageUrl}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
            {a.form.category} <span className="text-red-500">*</span>
          </label>
          <input id="category" name="category" type="text" defaultValue={product.category}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${state.errors?.category ? "border-red-400" : "border-gray-300"}`}
          />
          {state.errors?.category && <p className="text-red-500 text-xs mt-1">{state.errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="stock">
            {a.form.stock} <span className="text-red-500">*</span>
          </label>
          <input id="stock" name="stock" type="number" min="0" step="1" defaultValue={product.stock}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${state.errors?.stock ? "border-red-400" : "border-gray-300"}`}
          />
          {state.errors?.stock && <p className="text-red-500 text-xs mt-1">{state.errors.stock}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input id="available" name="available" type="checkbox" defaultChecked={product.available}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label className="text-sm font-medium text-gray-700" htmlFor="available">
            {a.form.available}
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <SubmitButton label={a.form.save} pendingLabel={a.form.saving} />
          <a href="/admin/products"
            className="px-6 py-2 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            {a.form.cancel}
          </a>
        </div>
      </form>
    </div>
  );
}
