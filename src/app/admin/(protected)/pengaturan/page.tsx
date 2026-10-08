import { getAllProjects, getCategories, getMedia, getSettings } from "@/lib/repo";
import { mediaFor } from "@/lib/media";
import { countCities, yearsSince } from "@/lib/site";
import { emailConfigured } from "@/lib/notify";
import { SettingsForm } from "@/components/admin/settings-form";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Info Perusahaan" };

export default async function AdminPengaturanPage() {
  const [settings, media, categories, projects] = await Promise.all([getSettings(), getMedia(), getCategories(), getAllProjects()]);
  const usage = Object.fromEntries(categories.map((c) => [c.id, projects.filter((p) => p.categories.includes(c.id)).length]));
  return (
    <div>
      <PageHeader
        eyebrow="Pengaturan"
        title="Info Perusahaan"
        description="Data yang dipakai di banyak tempat sekaligus: header, footer, halaman Hubungi, Legalitas, dan profil direktur."
      />
      <SettingsForm
        settings={settings}
        directorPhoto={mediaFor(media, "director.photo")}
        categories={categories}
        categoryUsage={usage}
        computed={{ years: yearsSince(settings.established, settings.stats.yearsActive), cities: countCities(projects.filter((p) => !p.hidden)) }}
        emailConfigured={emailConfigured}
      />
    </div>
  );
}
