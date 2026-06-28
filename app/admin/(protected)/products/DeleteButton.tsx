"use client";

import { useTransition } from "react";

export function DeleteButton({
  deleteAction,
}: {
  deleteAction: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

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
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
