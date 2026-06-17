import { AuthProviders } from "@/components/AuthProviders";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProviders>
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="mb-8">
          <Logo href="/" height={52} />
        </div>
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </AuthProviders>
  );
}
