import { getSession } from "@/lib/auth";
import { getAdminUsers } from "@/lib/repo";
import { AccountsManager } from "@/components/admin/accounts-manager";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Akun Admin" };

export default async function AdminAkunPage() {
  const [session, users] = await Promise.all([getSession(), getAdminUsers()]);
  return (
    <div>
      <PageHeader eyebrow="Pengaturan" title="Akun Admin" description="Ganti kata sandi Anda, atau beri akses ke rekan kerja dengan peran yang sesuai." />
      <AccountsManager
        me={session!.username}
        isAdmin={session!.role === "admin"}
        users={users.map((u) => ({ username: u.username, name: u.name, role: u.role }))}
      />
    </div>
  );
}
