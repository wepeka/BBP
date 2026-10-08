import {
  getAllJobs,
  getAllProjects,
  getAllTestimonials,
  getCategories,
  getEquipment,
  getLayout,
  getMedia,
  getServices,
  getSettings,
  getTeam,
  getTexts,
} from "@/lib/repo";
import { TEXT_FIELDS, TEXT_DEFAULTS, type TextField } from "@/lib/texts";
import { MEDIA_SLOTS, mediaFor } from "@/lib/media";
import { PAGES, orderedSections } from "@/lib/sections";
import { PageEditor, type EditorDraft, type EditorField, type EditorSlot } from "@/components/admin/page-editor";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Halaman Website" };

export default async function AdminHalamanPage({ searchParams }: { searchParams: Promise<{ halaman?: string }> }) {
  const params = await searchParams;
  const page = PAGES.find((p) => p.id === params.halaman) ?? PAGES[0];
  const [texts, media, layout, services, team, equipment, projects, categories, testimonials, jobs, settings] = await Promise.all([
    getTexts(),
    getMedia(),
    getLayout(),
    getServices(),
    getTeam(),
    getEquipment(),
    getAllProjects(),
    getCategories(),
    getAllTestimonials(),
    getAllJobs(),
    getSettings(),
  ]);

  const fields: EditorField[] = (TEXT_FIELDS as readonly TextField[])
    .filter((f) => f.page === page.id)
    .map((f) => ({
      key: f.key,
      label: f.label,
      section: f.section,
      default: TEXT_DEFAULTS[f.key as keyof typeof TEXT_DEFAULTS],
      multiline: f.multiline,
      vars: f.vars,
      columns: f.columns,
      hint: f.hint,
    }));
  const slots: EditorSlot[] = MEDIA_SLOTS.filter((s) => s.page === page.id).map((s) => ({
    key: s.key,
    label: s.label,
    section: s.section,
    hint: s.hint,
    multiple: s.multiple,
    projectLink: s.projectLink,
    aspect: s.aspect,
    default: s.default,
  }));

  const sections = orderedSections(page.id, layout);
  const initial: EditorDraft = {
    texts: Object.fromEntries(fields.map((f) => [f.key, texts[f.key as keyof typeof texts]])),
    media: Object.fromEntries(slots.map((s) => [s.key, mediaFor(media, s.key)])),
    layout: {
      order: sections.filter((s) => !s.fixed).map((s) => s.id),
      hidden: layout[page.id]?.hidden ?? [],
    },
    ...(page.id === "layanan" ? { services: services.map((s) => ({
            id: s.id,
            nameId: s.nameId,
            nameEn: s.nameEn,
            shortId: s.shortId,
            shortEn: s.shortEn,
            descriptionId: s.descriptionId,
            icon: s.icon,
            image: s.image ?? null,
            category: s.category ?? null,
            points: s.points ?? [],
          })) } : {}),
    ...(page.id === "tentang" ? { team: team.map((m) => ({ id: m.id, name: m.name, role: m.role, photo: m.photo ?? null })) } : {}),
    ...(page.id === "kapasitas" ? { equipment } : {}),
    ...(page.id === "beranda" ? { testimonials } : {}),
    ...(page.id === "karier" ? { jobs } : {}),
    ...(page.optional ? { pageVisible: !settings.hiddenPages.includes(page.id) } : {}),
  };

  return (
    <div>
      <PageHeader
        eyebrow="Konten"
        title="Halaman Website"
        description="Ubah tulisan, foto, dan susunan setiap bagian halaman. Bagian bisa disembunyikan atau diurutkan ulang, dan pratinjau di kanan ikut diperbarui setelah disimpan."
      />
      <PageEditor
        key={page.id}
        pageId={page.id}
        pageLabel={page.label}
        href={page.href}
        pages={PAGES.map((p) => ({ id: p.id, label: p.label }))}
        sections={sections}
        fields={fields}
        slots={slots}
        initial={initial}
        projects={projects.map((p) => ({ id: p.id, title: `${p.titleId} (${p.city}, ${p.year})` }))}
        categories={categories}
      />
    </div>
  );
}
