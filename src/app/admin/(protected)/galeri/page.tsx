import { libraryItems } from "@/lib/media-library";
import { MediaLibrary } from "@/components/admin/media-library";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Galeri Foto" };

export default async function AdminGaleriPage() {
  const items = await libraryItems();
  return (
    <div>
      <PageHeader
        eyebrow="Konten"
        title="Galeri Foto"
        description="Semua foto dan PDF yang dipakai website. Unggah di sini lalu pilih dari kolom foto mana pun — foto otomatis dikompres agar website tetap cepat."
      />
      <MediaLibrary items={items} />
    </div>
  );
}
