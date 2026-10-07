import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSession } from "@/lib/auth";
import { saveUpload, useBlob, UPLOAD_PREFIXES } from "@/lib/store";

/*
 * Admin uploads (photos, logos, certificate PDFs).
 *
 * - On Vercel the browser uploads straight to the private Blob store: this
 *   route only signs a short-lived token (JSON request), so files of any
 *   size skip the 4.5 MB function body limit.
 * - Locally, or as a fallback, the file is posted here as multipart form data
 *   and saved by the server.
 */
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "application/pdf"];
const MAX_BYTES = 30 * 1024 * 1024;

function validPathname(pathname: string): boolean {
  return (
    !pathname.includes("..") &&
    /^[a-z0-9/_.-]+$/i.test(pathname) &&
    UPLOAD_PREFIXES.some((p) => pathname.startsWith(p))
  );
}

async function canUpload(): Promise<boolean> {
  const session = await getSession();
  return Boolean(session && session.role !== "viewer");
}

export async function POST(request: Request): Promise<Response> {
  const type = request.headers.get("content-type") ?? "";

  if (type.includes("application/json")) {
    if (!useBlob) return Response.json({ error: "Blob storage is not configured" }, { status: 400 });
    const body = (await request.json()) as HandleUploadBody;
    try {
      const result = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async (pathname) => {
          if (!(await canUpload())) throw new Error("Sesi berakhir. Silakan masuk lagi.");
          if (!validPathname(pathname)) throw new Error("Lokasi file tidak diizinkan.");
          return {
            allowedContentTypes: ALLOWED_TYPES,
            maximumSizeInBytes: MAX_BYTES,
            addRandomSuffix: true,
          };
        },
      });
      return Response.json(result);
    } catch (error) {
      return Response.json({ error: (error as Error).message }, { status: 400 });
    }
  }

  if (!(await canUpload())) {
    return Response.json({ error: "Sesi berakhir. Silakan masuk lagi." }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const pathname = String(form?.get("pathname") ?? "");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "File tidak ditemukan." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: "Format file tidak didukung. Pakai JPG, PNG, WebP, atau PDF." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File terlalu besar (maksimal 30 MB)." }, { status: 400 });
  }
  if (!validPathname(pathname)) {
    return Response.json({ error: "Lokasi file tidak diizinkan." }, { status: 400 });
  }

  const url = await saveUpload(pathname, Buffer.from(await file.arrayBuffer()), file.type);
  return Response.json({ url, size: file.size });
}
