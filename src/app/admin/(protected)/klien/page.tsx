import { getAllClients, getAllProjects } from "@/lib/repo";
import { sameClient } from "@/lib/site";
import { ClientsManager } from "@/components/admin/clients-manager";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Klien" };

export default async function AdminKlienPage() {
  const [clients, projects] = await Promise.all([getAllClients(), getAllProjects()]);
  const projectCounts = Object.fromEntries(clients.map((c) => [c.id, projects.filter((p) => sameClient(p.client, c.name)).length]));
  return (
    <div>
      <PageHeader
        eyebrow="Konten"
        title="Klien"
        description="Logo dan nama klien tampil di Beranda (deretan bergerak) dan halaman Klien. Urutan di sini = urutan tampil."
      />
      <ClientsManager clients={clients} projectCounts={projectCounts} />
    </div>
  );
}
