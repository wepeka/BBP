/*
 * Browser-side upload helper used by every photo/PDF field in the admin.
 *
 * Photos are resized and re-encoded in the browser before they leave the
 * device (phone photos of 5–10 MB become ~300–600 KB WebP), then sent either
 * straight to the private Blob store (production) or to /api/admin/upload
 * (local development, and as a fallback).
 */

export type UploadMode = "blob" | "local";

export interface UploadOptions {
  mode: UploadMode;
  /** Sub-folder under images/uploads/, e.g. "proyek/gudang-batam". */
  folder: string;
  /** Longest side in pixels after resizing (photos 2400, logos 800). */
  maxSize?: number;
  onProgress?: (percent: number) => void;
}

export interface UploadResult {
  url: string;
  size: number;
  name: string;
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

function baseName(name: string): string {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) || "file"
  );
}

function cleanFolder(folder: string): string {
  return folder
    .split("/")
    .map((part) => baseName(part))
    .filter(Boolean)
    .join("/");
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Downscales and re-encodes a photo as WebP. Returns the original file when
 * the browser can't decode it, when it's an animated GIF, or when the result
 * wouldn't be smaller.
 */
export async function prepareImage(file: File, maxSize = 2400): Promise<File> {
  if (!IMAGE_TYPES.includes(file.type) || file.type === "image/gif") return file;
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file;
  }
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await canvasToBlob(canvas, "image/webp", 0.84);
  if (!blob || blob.type !== "image/webp" || (scale === 1 && blob.size >= file.size)) return file;
  return new File([blob], `${baseName(file.name)}.webp`, { type: "image/webp" });
}

function extensionFor(file: File): string {
  const fromType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/gif": "gif",
    "application/pdf": "pdf",
  };
  return fromType[file.type] ?? (file.name.split(".").pop() || "bin").toLowerCase();
}

export function isAcceptedFile(file: File, accept: "image" | "pdf"): boolean {
  return accept === "pdf" ? file.type === "application/pdf" : IMAGE_TYPES.includes(file.type);
}

async function uploadViaServer(file: File, pathname: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("pathname", pathname);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error || "Upload gagal. Coba lagi.");
  return data.url;
}

export async function uploadFile(original: File, opts: UploadOptions): Promise<UploadResult> {
  const isPdf = original.type === "application/pdf";
  const file = isPdf ? original : await prepareImage(original, opts.maxSize ?? 2400);
  const stamp = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const folder = cleanFolder(opts.folder) || "umum";
  const pathname = isPdf
    ? `documents/${folder}/${baseName(original.name)}-${stamp}.pdf`
    : `images/uploads/${folder}/${baseName(original.name)}-${stamp}.${extensionFor(file)}`;

  opts.onProgress?.(5);
  let url: string;
  if (opts.mode === "blob") {
    try {
      const { upload } = await import("@vercel/blob/client");
      const blob = await upload(pathname, file, {
        access: "private",
        handleUploadUrl: "/api/admin/upload",
        contentType: file.type,
        multipart: file.size > 8 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => opts.onProgress?.(Math.max(5, Math.round(percentage))),
      });
      url = `/media/${blob.pathname}`;
    } catch (error) {
      // The direct upload can fail behind strict networks; small files can
      // still go through the server.
      if (file.size > 4 * 1024 * 1024) throw error;
      url = await uploadViaServer(file, pathname);
    }
  } else {
    url = await uploadViaServer(file, pathname);
  }
  opts.onProgress?.(100);
  return { url, size: file.size, name: original.name };
}
