"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState, useEffect } from "react";
import { submitContactForm, type ContactState } from "./actions";
import { useLocale } from "@/app/components/LocaleProvider";

const initialState: ContactState = {};

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export default function ContactForm({ defaultProduct, defaultProductId }: { defaultProduct: string; defaultProductId: string }) {
  const { t } = useLocale();
  const [state, formAction] = useFormState(submitContactForm, initialState);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (state.status === "success") {
      setFormKey((k) => k + 1);
    }
  }, [state.status]);

  return (
    <div>
      {state.status === "success" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {t.contact.success}
        </div>
      )}

      {state.status === "error" && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {state.errorMessage ?? t.contact.genericError}
        </div>
      )}

      <form key={formKey} action={formAction} className="space-y-5">
        <input type="hidden" name="productId" value={defaultProductId} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
            {t.contact.name} <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              state.errors?.name ? "border-red-400" : "border-gray-300"
            }`}
          />
          {state.errors?.name && (
            <p className="text-red-500 text-xs mt-1">{state.errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            {t.contact.email} <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              state.errors?.email ? "border-red-400" : "border-gray-300"
            }`}
          />
          {state.errors?.email && (
            <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product">
            {t.contact.productOfInterest} <span className="text-red-500">*</span>
          </label>
          <input
            id="product"
            name="product"
            type="text"
            defaultValue={defaultProduct}
            className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              state.errors?.product ? "border-red-400" : "border-gray-300"
            }`}
          />
          {state.errors?.product && (
            <p className="text-red-500 text-xs mt-1">{state.errors.product}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
            {t.contact.message} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              state.errors?.message ? "border-red-400" : "border-gray-300"
            }`}
          />
          {state.errors?.message && (
            <p className="text-red-500 text-xs mt-1">{state.errors.message}</p>
          )}
        </div>

        <SubmitButton label={t.contact.send} pendingLabel={t.contact.sending} />
      </form>
    </div>
  );
}
