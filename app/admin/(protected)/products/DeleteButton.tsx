"use client";

import { useTransition } from "react";
import { useAdminLocale } from "@/app/components/AdminLocaleProvider";

export function DeleteButton({
  deleteAction,
  label,
}: {
  deleteAction: () => Promise<void>;
  label?: string;
}) {
  const { t } = useAdminLocale();
  const [isPending, startTransition] = useTransition();
  const deleteLabel = label ?? t.admin.table.delete;

  function handleClick() {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    startTransition(async () => {
      await deleteAction();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-red-600 hover:underline text-sm disabled:opacity-50"
    >
      {isPending ? "…" : deleteLabel}
    </button>
  );
}
