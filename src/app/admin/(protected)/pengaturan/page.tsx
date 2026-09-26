import { getSettings } from "@/lib/repo";
import { PageHeader, Card, Field, TextAreaField } from "@/components/admin/field";
import { SubmitButton } from "@/components/admin/submit-button";
import { updateSettingsAction } from "@/app/admin/(protected)/pengaturan/actions";

export const metadata = { title: "Pengaturan — Admin" };

export default async function AdminPengaturanPage() {
  const s = await getSettings();

  return (
    <div>
      <PageHeader title="Pengaturan Situs" description="Identitas, kontak, dan profil direktur. Tulisan di tiap halaman diubah lewat menu Teks Website." />
      <form action={updateSettingsAction} className="max-w-3xl space-y-8">
        <Card className="space-y-5">
          <h2 className="text-[15px] font-bold text-[var(--color-ink)]">Identitas Perusahaan</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nama Perusahaan" name="companyName" required defaultValue={s.companyName} />
            <Field label="Tagline" name="tagline" required defaultValue={s.tagline} />
          </div>
          <Field label="Tagline Panjang" name="taglineLong" defaultValue={s.taglineLong} />
        </Card>

        <Card className="space-y-5">
          <h2 className="text-[15px] font-bold text-[var(--color-ink)]">Kontak</h2>
          <Field label="Alamat" name="address" required defaultValue={s.address} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Telepon" name="phone" required defaultValue={s.phone} />
            <Field label="Fax" name="fax" defaultValue={s.fax} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" name="email" type="email" required defaultValue={s.email} />
            <Field
              label="Nomor WhatsApp"
              name="whatsapp"
              required
              defaultValue={s.whatsapp}
              hint="Format internasional tanpa + atau spasi, mis. 62851xxxxxxx"
            />
          </div>
          <Field label="Jam Kerja" name="workingHours" defaultValue={s.workingHours} />
        </Card>

        <Card className="space-y-5">
          <h2 className="text-[15px] font-bold text-[var(--color-ink)]">Direktur</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nama" name="directorName" required defaultValue={s.director.name} />
            <Field label="Jabatan" name="directorRole" defaultValue={s.director.role} />
          </div>
          <TextAreaField label="Biografi Singkat" name="directorBio" rows={5} defaultValue={s.director.bioId} />
        </Card>

        <SubmitButton>Simpan Pengaturan</SubmitButton>
      </form>
    </div>
  );
}
