import { AppShell } from "@/components/AppShell";
import { AuthGuard } from "@/components/AuthGuard";
import { OrganizationProvider } from "@/components/OrganizationProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <OrganizationProvider>
        <AppShell>{children}</AppShell>
      </OrganizationProvider>
    </AuthGuard>
  );
}
