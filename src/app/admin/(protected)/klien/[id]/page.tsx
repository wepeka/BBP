import { notFound } from "next/navigation";
import { getClients } from "@/lib/repo";
import { PageHeader, Card } from "@/components/admin/field";
import { ClientForm } from "@/components/admin/client-form";
import { updateClientAction } from "@/app/admin/(protected)/klien/actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const clients = await getClients();
  const client = clients.find((c) => c.id === id);
  return { title: client?.name ?? "Klien" };
}

export default async function AdminKlienEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const clients = await getClients();
  const client = clients.find((c) => c.id === id);
  if (!client) notFound();

  return (
    <div>
      <PageHeader title={client.name} />
      <Card className="max-w-xl">
        <ClientForm action={updateClientAction.bind(null, client.id)} client={client} />
      </Card>
    </div>
  );
}
