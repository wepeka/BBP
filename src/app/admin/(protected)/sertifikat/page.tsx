import { getAllCertificates } from "@/lib/repo";
import { CertificatesManager } from "@/components/admin/certificates-manager";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Sertifikat & Legalitas" };

export default async function AdminSertifikatPage() {
  const certificates = await getAllCertificates();
  return (
    <div>
      <PageHeader
        eyebrow="Konten"
        title="Sertifikat & Legalitas"
        description="Dokumen di halaman Legalitas. Isi tanggal berlaku agar status otomatis berubah jadi kedaluwarsa dan Anda diingatkan 60 hari sebelumnya."
      />
      <CertificatesManager certificates={certificates} />
    </div>
  );
}
