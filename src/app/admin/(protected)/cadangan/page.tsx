import { getSession } from "@/lib/auth";
import { BackupPanel } from "@/components/admin/backup-panel";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Cadangan Data" };

export default async function AdminCadanganPage() {
  const session = await getSession();
  return (
    <div>
      <PageHeader
        eyebrow="Pengaturan"
        title="Cadangan Data"
        description="Simpan salinan seluruh isi website (teks, proyek, klien, sertifikat, layanan, tim, inbox) dalam satu file. Foto tidak ikut — foto tetap aman di Galeri."
      />
      <BackupPanel isAdmin={session?.role === "admin"} />
    </div>
  );
}
