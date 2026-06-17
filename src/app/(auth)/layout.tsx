import Link from "next/link";
import { AuthProviders } from "@/components/AuthProviders";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProviders>
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-paper px-4 py-12">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <Link href="/expenses" className="mb-8 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
            E
          </span>
          <span className="text-lg font-bold text-ink">ExpenseKit</span>
        </Link>
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </AuthProviders>
  );
}
