"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Loader2, Trash2, X } from "lucide-react";
import { ICONS, ICON_OPTIONS } from "@/lib/icons";
import { buttonClass, inputClass } from "./ui";

/* ---------- Inputs ---------- */

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  id?: string;
}) {
  return (
    <label className={`inline-flex cursor-pointer items-start gap-3 ${disabled ? "cursor-not-allowed opacity-60" : ""}`}>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-[22px] w-[38px] shrink-0 rounded-full transition-colors ${
          checked ? "bg-[var(--color-teal)]" : "bg-[var(--color-line-2)]"
        }`}
      >
        <span
          className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[19px]" : "translate-x-[3px]"}`}
        />
      </button>
      {(label || description) && (
        <span className="leading-tight">
          {label && <span className="block text-[13.5px] font-semibold text-[var(--color-ink)]">{label}</span>}
          {description && <span className="mt-0.5 block text-[12.5px] text-[var(--color-ink-3)]">{description}</span>}
        </span>
      )}
    </label>
  );
}

/** Textarea that grows with its content. */
export function AutoTextarea({
  value,
  onChange,
  minRows = 2,
  className = "",
  ...rest
}: Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> & {
  value: string;
  onChange: (v: string) => void;
  minRows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={minRows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} resize-none leading-relaxed ${className}`}
      {...rest}
    />
  );
}

export function IconSelect({ value, onChange, id }: { value: string; onChange: (v: string) => void; id?: string }) {
  const Icon = ICONS[value]?.icon;
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-[var(--color-teal-soft)] text-[var(--color-teal-text)]">
        {Icon ? <Icon size={18} aria-hidden="true" /> : null}
      </span>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {!ICONS[value] && <option value={value}>{value || "Pilih ikon"}</option>}
        {ICON_OPTIONS.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------- Reordering ---------- */

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/**
 * Drag-to-reorder for a vertical list, plus keyboard/touch-friendly up/down
 * buttons rendered by RowControls. Returns props to spread on each row.
 */
export function useSortable<T>(items: T[], onChange: (next: T[]) => void) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function rowProps(index: number) {
    return {
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
          e.preventDefault();
          return;
        }
        setDragIndex(index);
        e.dataTransfer.effectAllowed = "move";
      },
      onDragOver: (e: React.DragEvent) => {
        if (dragIndex === null) return;
        e.preventDefault();
        setOverIndex(index);
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        if (dragIndex !== null) onChange(moveItem(items, dragIndex, index));
        setDragIndex(null);
        setOverIndex(null);
      },
      onDragEnd: () => {
        setDragIndex(null);
        setOverIndex(null);
      },
      "data-dragging": dragIndex === index || undefined,
      "data-over": (overIndex === index && dragIndex !== null && dragIndex !== index) || undefined,
    };
  }

  return { rowProps };
}

export function RowControls({
  index,
  count,
  onMove,
  onRemove,
  removeLabel = "Hapus",
  compact,
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove?: () => void;
  removeLabel?: string;
  compact?: boolean;
}) {
  const btn =
    "flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] disabled:opacity-30 disabled:hover:bg-transparent";
  return (
    <div className={`flex items-center ${compact ? "" : "gap-0.5"}`}>
      <span className="hidden cursor-grab px-1 text-[var(--color-ink-3)] active:cursor-grabbing sm:block" title="Seret untuk memindah" aria-hidden="true">
        <GripVertical size={16} />
      </span>
      <button type="button" className={btn} onClick={() => onMove(index - 1)} disabled={index === 0} aria-label="Pindah ke atas">
        <ArrowUp size={15} aria-hidden="true" />
      </button>
      <button type="button" className={btn} onClick={() => onMove(index + 1)} disabled={index === count - 1} aria-label="Pindah ke bawah">
        <ArrowDown size={15} aria-hidden="true" />
      </button>
      {onRemove && (
        <button type="button" className={`${btn} hover:!bg-[var(--color-red)]/10 hover:!text-[var(--color-red)]`} onClick={onRemove} aria-label={removeLabel} title={removeLabel}>
          <Trash2 size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/* ---------- Modal ---------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className={`m-auto max-h-[92dvh] overflow-hidden rounded-[10px] border border-[var(--color-line)] bg-[var(--color-bg)] p-0 text-[var(--color-ink)] shadow-2xl backdrop:bg-black/55`}
      style={{ width: `min(96vw, ${wide ? 980 : 640}px)` }}
    >
      {open && (
        <div className="flex max-h-[92dvh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-3.5">
            <h2 className="text-[16px] font-bold">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Tutup" className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
          {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-3">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}

/* ---------- Unsaved changes & save bar ---------- */

/** Warns before leaving the page with unsaved edits, and saves on Ctrl/Cmd+S. */
export function useEditorGuards(dirty: boolean, onSave: () => void) {
  const saveRef = useRef(onSave);
  useEffect(() => {
    saveRef.current = onSave;
  });

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

export function SaveBar({
  dirty,
  saving,
  onSave,
  onReset,
  saveLabel = "Simpan perubahan",
  note,
  disabled,
}: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onReset?: () => void;
  saveLabel?: string;
  note?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div
      className={`sticky bottom-3 z-30 mt-8 flex flex-wrap items-center gap-3 rounded-[8px] border px-4 py-3 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.45)] backdrop-blur transition-colors ${
        dirty ? "border-[var(--color-yellow)] bg-[var(--color-dirty-bg)]" : "border-[var(--color-line)] bg-[var(--color-surface)]/95"
      }`}
    >
      <button type="button" onClick={onSave} disabled={saving || disabled || !dirty} className={buttonClass("primary")}>
        {saving && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
        {saving ? "Menyimpan…" : saveLabel}
      </button>
      {dirty && onReset && !saving && (
        <button type="button" onClick={onReset} className={buttonClass("ghost")}>
          Batalkan perubahan
        </button>
      )}
      <span className="text-[12.5px] text-[var(--color-ink-2)]">
        {dirty ? "Ada perubahan yang belum disimpan · Ctrl/⌘ + S untuk simpan" : note ?? "Semua perubahan sudah tersimpan."}
      </span>
    </div>
  );
}
