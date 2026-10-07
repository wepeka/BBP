import { getSession } from "@/lib/auth";
import { exportAll } from "@/lib/repo";

/** Downloads every content collection as one JSON file (admin accounts excluded). */
export async function GET(): Promise<Response> {
  const session = await getSession();
  if (!session || session.role === "viewer") return new Response("Tidak diizinkan", { status: 401 });
  const data = await exportAll();
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
  return new Response(JSON.stringify({ format: "bbp-backup", version: 1, createdAt: new Date().toISOString(), data }, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="cadangan-website-bbp-${stamp}.json"`,
      "cache-control": "no-store",
    },
  });
}
