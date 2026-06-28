"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateProduct, type UpdateProductState } from "../actions";
import type { ProductModel } from "@/app/generated/prisma/models";

const initialState: UpdateProductState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save Changes"}
    </button>
  );
}

export function EditProductForm({ product }: { product: ProductModel }) {
  const updateWithId = updateProduct.bind(null, product.id);
  const [state, formAction] = useFormState(updateWithId, initialState);

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <a
          href="/admin/products"
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Products
        </a>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <form
        action={formAction}
        className="space-y-5 bg-white p-6 rounded-lg border border-gray-200"
      >
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="name"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={product.name}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              state.errors?.name ? "border-red-400" : "border-gray-300"
            }`}
          />
          {state.errors?.name && (
            <p className="text-red-500 text-xs mt-1">{state.errors.name}</p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={product.description}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="price"
          >
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product.price}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              state.errors?.price ? "border-red-400" : "border-gray-300"
            }`}
          />
          {state.errors?.price && (
            <p className="text-red-500 text-xs mt-1">{state.errors.price}</p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="imageUrl"
          >
            Image URL <span className="text-red-500">*</span>
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            placeholder="https://..."
            defaultValue={product.imageUrl}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              state.errors?.imageUrl ? "border-red-400" : "border-gray-300"
            }`}
          />
          {state.errors?.imageUrl && (
            <p className="text-red-500 text-xs mt-1">{state.errors.imageUrl}</p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="category"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={product.category}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              state.errors?.category ? "border-red-400" : "border-gray-300"
            }`}
          />
          {state.errors?.category && (
            <p className="text-red-500 text-xs mt-1">{state.errors.category}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="available"
            name="available"
            type="checkbox"
            defaultChecked={product.available}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="available"
          >
            Available for purchase
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <SubmitButton />
          <a
            href="/admin/products"
            className="px-6 py-2 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
