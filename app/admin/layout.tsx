import { AppLayout } from "@/components/layout/AppLayout";
import { AdminPrefetch } from "@/components/layout/AdminPrefetch";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminPrefetch>
      <AppLayout role="admin">{children}</AppLayout>
    </AdminPrefetch>
  );
}
