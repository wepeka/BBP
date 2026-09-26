import { get } from "@vercel/blob";

// Serves admin uploads (project photos, certificate PDFs) from the private
// Blob store. Only upload folders are exposed — never content/*.json, which
// holds admin accounts and RFQ leads.
const ALLOWED_PREFIXES = ["images/uploads/", "documents/"];

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathname = path.map(decodeURIComponent).join("/");
  if (pathname.includes("..") || !ALLOWED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return new Response("Not found", { status: 404 });
  }

  const res = await get(pathname, { access: "private" }).catch(() => null);
  if (!res || res.statusCode !== 200) return new Response("Not found", { status: 404 });

  return new Response(res.stream, {
    headers: {
      "content-type": res.blob.contentType,
      // Upload pathnames carry a random suffix, so their content never changes.
      "cache-control": "public, max-age=31536000, immutable",
      "content-disposition": res.blob.contentDisposition,
    },
  });
}
