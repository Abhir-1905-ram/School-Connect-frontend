import { AppLayout } from "@/components/layout/AppLayout";
import { PartnerFab } from "@/components/partner/PartnerFab";
import { PartnerPrefetch } from "@/components/layout/PartnerPrefetch";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PartnerPrefetch>
      <AppLayout role="partner">
        {children}
        <PartnerFab />
      </AppLayout>
    </PartnerPrefetch>
  );
}
