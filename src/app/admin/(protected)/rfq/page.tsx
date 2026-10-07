import { getRfqEntries, getServices, getSettings } from "@/lib/repo";
import { RfqInbox } from "@/components/admin/rfq-inbox";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Inbox Penawaran" };

export default async function AdminRfqPage() {
  const [entries, services, settings] = await Promise.all([getRfqEntries(), getServices(), getSettings()]);
  return (
    <div>
      <PageHeader
        eyebrow="Penawaran"
        title="Inbox Penawaran"
        description="Permintaan dari formulir Hubungi Kami. Ubah status untuk melacak tindak lanjut — status dan catatan hanya terlihat oleh admin."
      />
      <RfqInbox entries={entries} services={services.map((s) => ({ id: s.id, name: s.nameId }))} companyShort={settings.shortName} />
    </div>
  );
}
