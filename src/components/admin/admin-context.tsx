"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import type { UploadMode } from "@/lib/upload-client";
import type { AdminRole } from "@/lib/types";
import { buttonClass } from "./ui";

/*
 * App-wide admin services: upload mode, the signed-in role, toasts, and a
 * confirm dialog. Provided once by AdminShell.
 */

interface Toast {
  id: number;
  tone: "success" | "error";
  message: string;
}

interface ConfirmOptions {
  title: string;
  body?: string;
  confirmLabel?: string;
  danger?: boolean;
}

interface AdminContextValue {
  uploadMode: UploadMode;
  role: AdminRole;
  canEdit: boolean;
  toast: (message: string, tone?: Toast["tone"]) => void;
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
}

const Ctx = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAdmin must be used inside AdminProvider");
  return v;
}

export function AdminProvider({
  uploadMode,
  role,
  children,
}: {
  uploadMode: UploadMode;
  role: AdminRole;
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const toast = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = nextId.current++;
    setToasts((t) => [...t, { id, tone, message }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), tone === "error" ? 7000 : 3500);
  }, []);

  const [pending, setPending] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const confirm = useCallback(
    (opts: ConfirmOptions) => new Promise<boolean>((resolve) => setPending({ ...opts, resolve })),
    []
  );

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (pending && !d.open) d.showModal();
    if (!pending && d.open) d.close();
  }, [pending]);

  function answer(v: boolean) {
    pending?.resolve(v);
    setPending(null);
  }

  return (
    <Ctx.Provider value={{ uploadMode, role, canEdit: role !== "viewer", toast, confirm }}>
      {children}

      <div className="pointer-events-none fixed bottom-4 left-1/2 z-[300] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2 sm:left-auto sm:right-5 sm:translate-x-0" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.tone === "error" ? "alert" : "status"}
            className={`menu-item-in pointer-events-auto flex items-start gap-2.5 rounded-[8px] px-4 py-3 text-[14px] font-medium shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)] ${
              t.tone === "error" ? "bg-[var(--color-red)] text-white" : "bg-[#0f1f17] text-white"
            }`}
          >
            {t.tone === "error" ? (
              <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            ) : (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--color-yellow)]" aria-hidden="true" />
            )}
            <span className="flex-1">{t.message}</span>
            <button type="button" onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))} aria-label="Tutup" className="opacity-70 hover:opacity-100">
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => pending && answer(false)}
        className="m-auto w-[min(92vw,440px)] rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface)] p-0 text-[var(--color-ink)] shadow-2xl backdrop:bg-black/50"
      >
        {pending && (
          <div className="p-6">
            <h2 className="text-[17px] font-bold">{pending.title}</h2>
            {pending.body && <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-2)]">{pending.body}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => answer(false)} className={buttonClass("secondary")}>
                Batal
              </button>
              <button type="button" autoFocus onClick={() => answer(true)} className={buttonClass(pending.danger ? "danger" : "primary")}>
                {pending.confirmLabel ?? "Ya, lanjutkan"}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </Ctx.Provider>
  );
}
