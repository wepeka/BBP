import { getSession } from "@/lib/auth";
import { libraryItems } from "@/lib/media-library";

/** Media library listing for the admin photo picker and the Galeri page. */
export async function GET(): Promise<Response> {
  const session = await getSession();
  if (!session) return Response.json({ error: "Sesi berakhir. Silakan masuk lagi." }, { status: 401 });
  const items = await libraryItems();
  return Response.json({ items }, { headers: { "cache-control": "no-store" } });
}
