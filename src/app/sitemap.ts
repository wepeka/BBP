import type { MetadataRoute } from "next";
import { getProjects, getSettings } from "@/lib/repo";
import { isPageHidden } from "@/lib/sections";
import { SITE_URL } from "@/lib/site";

// New projects added in the admin show up within the hour.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);
  const now = new Date();
  const pages = ["", "/tentang", "/layanan", "/proyek", "/kapasitas", "/legalitas", "/klien", "/hubungi", "/k3", "/karier"].filter(
    (p) => !isPageHidden(p.slice(1), settings.hiddenPages)
  );
  return [
    ...pages.map((p) => ({
      url: `${SITE_URL}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : p === "/proyek" || p === "/hubungi" ? 0.9 : 0.7,
    })),
    ...projects.map((p) => ({
      url: `${SITE_URL}/proyek/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      ...(p.images[0] ? { images: [`${SITE_URL}${p.images[0]}`] } : {}),
    })),
  ];
}
