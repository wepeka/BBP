"use client";

import { Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  confirmText,
  label = "Hapus",
}: {
  action: () => void | Promise<void>;
  confirmText: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-red)]/30 px-3 py-1.5 text-[12.5px] font-medium text-[var(--color-red)] hover:bg-[var(--color-red)]/10"
      >
        <Trash2 size={13} aria-hidden="true" /> {label}
      </button>
    </form>
  );
}
