import Link from "next/link";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { getServices, getTeam, getTextOverrides, getTexts } from "@/lib/repo";
import { TEXT_DEFAULTS, TEXT_FIELDS, TEXT_PAGES, type TextField } from "@/lib/texts";
import { PageHeader, Card, Field, TextAreaField } from "@/components/admin/field";
import { SubmitButton } from "@/components/admin/submit-button";
import { saveTextsAction } from "@/app/admin/(protected)/teks/actions";

export const metadata = { title: "Teks Website — Admin" };

function rowsFor(text: string) {
  return Math.min(14, Math.max(2, Math.ceil(text.length / 70) + text.split("\n").length - 1));
}

export default async function AdminTeksPage({
  searchParams,
}: {
  searchParams: Promise<{ halaman?: string; tersimpan?: string }>;
}) {
  const params = await searchParams;
  const page = TEXT_PAGES.find((p) => p.id === params.halaman) ?? TEXT_PAGES[0];
  const [texts, overrides, services, team] = await Promise.all([
    getTexts(),
    getTextOverrides(),
    getServices(),
    getTeam(),
  ]);

  const fields: readonly TextField[] = TEXT_FIELDS.filter((f) => f.page === page.id);
  const sections = Array.from(new Set(fields.map((f) => f.section)));
  const save = saveTextsAction.bind(null, page.id);

  return (
    <div>
      <PageHeader
        title="Teks Website"
        description="Ubah tulisan di setiap halaman. Kosongkan kolom lalu simpan untuk mengembalikan ke teks awal."
        action={
          <a
            href={page.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-line-2)] px-3.5 py-2 text-[13.5px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]"
          >
            Lihat halaman <ExternalLink size={14} aria-hidden="true" />
          </a>
        }
      />

      <nav className="mb-6 flex flex-wrap gap-2" aria-label="Pilih halaman">
        {TEXT_PAGES.map((p) => (
          <Link
            key={p.id}
            href={`/admin/teks?halaman=${p.id}`}
            aria-current={p.id === page.id ? "page" : undefined}
            className={`rounded-full px-3.5 py-1.5 text-[13.5px] font-medium transition-colors ${
              p.id === page.id
                ? "bg-[var(--color-teal)] text-[var(--color-on-teal)]"
                : "border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
            }`}
          >
            {p.label}
          </Link>
        ))}
      </nav>

      {params.tersimpan && (
        <p className="mb-6 flex items-center gap-2 rounded-md bg-[var(--color-teal-soft)] px-4 py-3 text-[14px] font-medium text-[var(--color-teal-text)]">
          <CheckCircle2 size={17} aria-hidden="true" />
          Tersimpan. Perubahan sudah tampil di halaman {page.label}.
        </p>
      )}

      <form key={page.id} action={save} className="max-w-3xl space-y-8">
        {sections.map((section) => (
          <Card key={section} className="space-y-5">
            <h2 className="text-[15px] font-bold text-[var(--color-ink)]">{section}</h2>
            {fields
              .filter((f) => f.section === section)
              .map((f) => {
                const value = texts[f.key as keyof typeof texts];
                const changed = f.key in overrides;
                const hints = [
                  f.list && `Satu baris per item, format: ${f.list}`,
                  f.vars && `Bisa memakai: ${f.vars.map((v) => `{${v}}`).join(" ")} (terisi otomatis)`,
                  changed && `Teks awal: “${TEXT_DEFAULTS[f.key as keyof typeof TEXT_DEFAULTS].slice(0, 90)}${TEXT_DEFAULTS[f.key as keyof typeof TEXT_DEFAULTS].length > 90 ? "…" : ""}”`,
                ]
                  .filter(Boolean)
                  .join(" · ");
                const label = changed ? `${f.label} • diubah` : f.label;
                return f.multiline || value.length > 90 ? (
                  <TextAreaField key={f.key} label={label} name={f.key} defaultValue={value} rows={rowsFor(value)} hint={hints || undefined} />
                ) : (
                  <Field key={f.key} label={label} name={f.key} defaultValue={value} hint={hints || undefined} />
                );
              })}
          </Card>
        ))}

        {page.id === "tentang" && (
          <Card className="space-y-5">
            <h2 className="text-[15px] font-bold text-[var(--color-ink)]">Daftar tim inti</h2>
            <TextAreaField
              label="Anggota tim"
              name="team"
              rows={Math.max(4, team.length + 1)}
              defaultValue={team.map((m) => `${m.name} | ${m.role}`).join("\n")}
              hint="Satu baris per orang, format: Nama | Jabatan. Urutan baris = urutan tampil."
            />
          </Card>
        )}

        {page.id === "layanan" &&
          services.map((s, i) => (
            <Card key={s.id} className="space-y-5">
              <h2 className="text-[15px] font-bold text-[var(--color-ink)]">
                Layanan {i + 1}: {s.nameId}
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nama layanan" name={`svc.${s.id}.nameId`} required defaultValue={s.nameId} />
                <Field label="Nama dalam bahasa Inggris (teks miring)" name={`svc.${s.id}.nameEn`} defaultValue={s.nameEn} />
              </div>
              <TextAreaField
                label="Ringkasan (kartu di beranda)"
                name={`svc.${s.id}.shortId`}
                rows={2}
                defaultValue={s.shortId}
              />
              <TextAreaField
                label="Deskripsi lengkap (halaman Layanan)"
                name={`svc.${s.id}.descriptionId`}
                rows={rowsFor(s.descriptionId)}
                defaultValue={s.descriptionId}
              />
            </Card>
          ))}

        <div className="sticky bottom-4 z-10 flex items-center gap-3 rounded-md border border-[var(--color-line)] bg-[var(--color-surface)]/95 p-3 shadow-[var(--shadow-card)] backdrop-blur">
          <SubmitButton>Simpan Teks {page.label}</SubmitButton>
          <span className="text-[12.5px] text-[var(--color-ink-3)]">Perubahan langsung tampil di website setelah disimpan.</span>
        </div>
      </form>
    </div>
  );
}
