"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { isAcceptedFile, uploadFile, type UploadResult } from "@/lib/upload-client";
import { useAdmin } from "./admin-context";

interface Job {
  name: string;
  progress: number;
  state: "uploading" | "done" | "error";
  error?: string;
}

/**
 * Drag & drop (or tap to choose) uploader. Photos are compressed in the
 * browser before upload; several files upload three at a time.
 */
export function UploadZone({
  folder,
  accept = "image",
  multiple = true,
  maxSize,
  onUploaded,
  compact,
  label,
}: {
  folder: string;
  accept?: "image" | "pdf";
  multiple?: boolean;
  maxSize?: number;
  onUploaded: (results: UploadResult[]) => void;
  compact?: boolean;
  label?: string;
}) {
  const { uploadMode, toast, canEdit } = useAdmin();
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const busy = jobs.some((j) => j.state === "uploading");

  async function handle(files: File[]) {
    if (!canEdit) return;
    const list = (multiple ? files : files.slice(0, 1)).filter(Boolean);
    const rejected = list.filter((f) => !isAcceptedFile(f, accept));
    if (rejected.length) {
      toast(
        accept === "pdf"
          ? "Hanya file PDF yang bisa diunggah di sini."
          : `${rejected.map((f) => f.name).join(", ")} bukan foto JPG/PNG/WebP. Foto HEIC dari iPhone: ubah dulu ke JPG (Pengaturan Kamera → Format → Paling Kompatibel).`,
        "error"
      );
    }
    const ok = list.filter((f) => isAcceptedFile(f, accept));
    if (!ok.length) return;

    const start = jobs.length;
    setJobs((j) => [...j, ...ok.map((f) => ({ name: f.name, progress: 0, state: "uploading" as const }))]);
    const results: (UploadResult | null)[] = new Array(ok.length).fill(null);
    let cursor = 0;

    async function worker() {
      while (cursor < ok.length) {
        const i = cursor++;
        const setJob = (patch: Partial<Job>) => setJobs((all) => all.map((j, k) => (k === start + i ? { ...j, ...patch } : j)));
        try {
          results[i] = await uploadFile(ok[i], {
            mode: uploadMode,
            folder,
            maxSize,
            onProgress: (progress) => setJob({ progress }),
          });
          setJob({ state: "done", progress: 100 });
        } catch (e) {
          setJob({ state: "error", error: (e as Error).message });
        }
      }
    }
    await Promise.all([worker(), worker(), worker()]);

    const done = results.filter(Boolean) as UploadResult[];
    if (done.length) onUploaded(done);
    const failed = ok.length - done.length;
    if (failed) toast(`${failed} file gagal diunggah. Periksa koneksi lalu coba lagi.`, "error");
    window.setTimeout(() => setJobs((all) => all.filter((j) => j.state === "error")), 1500);
  }

  return (
    <div>
      <button
        type="button"
        disabled={!canEdit}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          handle(Array.from(e.dataTransfer.files));
        }}
        className={`flex w-full flex-col items-center justify-center gap-1.5 rounded-[8px] border-2 border-dashed text-center transition-colors ${
          compact ? "px-4 py-5" : "px-6 py-10"
        } ${
          over
            ? "border-[var(--color-teal)] bg-[var(--color-teal-soft)]"
            : "border-[var(--color-line-2)] bg-[var(--color-surface)] hover:border-[var(--color-teal)] hover:bg-[var(--color-teal-soft)]/40"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {busy ? (
          <Loader2 size={compact ? 22 : 28} className="animate-spin text-[var(--color-teal)]" aria-hidden="true" />
        ) : (
          <UploadCloud size={compact ? 22 : 28} className="text-[var(--color-teal)]" aria-hidden="true" />
        )}
        <span className="text-[14px] font-semibold text-[var(--color-ink)]">
          {label ?? (accept === "pdf" ? "Pilih atau seret file PDF ke sini" : multiple ? "Pilih atau seret foto ke sini" : "Pilih atau seret foto ke sini")}
        </span>
        <span className="text-[12px] text-[var(--color-ink-3)]">
          {accept === "pdf" ? "PDF, maksimal 30 MB" : `JPG, PNG, atau WebP${multiple ? " · bisa banyak sekaligus" : ""} · otomatis dikompres`}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        hidden
        multiple={multiple}
        accept={accept === "pdf" ? "application/pdf" : "image/jpeg,image/png,image/webp,image/avif,image/gif"}
        onChange={(e) => {
          handle(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      {jobs.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {jobs.map((j, i) => (
            <li key={i} className="flex items-center gap-2.5 text-[12.5px] text-[var(--color-ink-2)]">
              {j.state === "done" ? (
                <CheckCircle2 size={15} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
              ) : j.state === "error" ? (
                <AlertCircle size={15} className="shrink-0 text-[var(--color-red)]" aria-hidden="true" />
              ) : (
                <Loader2 size={15} className="shrink-0 animate-spin text-[var(--color-teal)]" aria-hidden="true" />
              )}
              <span className="min-w-0 flex-1 truncate">{j.name}</span>
              {j.state === "uploading" && (
                <span className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                  <span className="block h-full bg-[var(--color-teal)] transition-all" style={{ width: `${j.progress}%` }} />
                </span>
              )}
              {j.state === "error" && <span className="text-[var(--color-red)]">{j.error}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
