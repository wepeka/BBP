import { PageHeader, Card } from "@/components/admin/field";
import { ClientForm } from "@/components/admin/client-form";
import { createClientAction } from "@/app/admin/(protected)/klien/actions";

export const metadata = { title: "Klien Baru — Admin" };

export default function AdminKlienBaruPage() {
  return (
    <div>
      <PageHeader title="Tambah Klien" />
      <Card className="max-w-xl">
        <ClientForm action={createClientAction} />
      </Card>
    </div>
  );
}
