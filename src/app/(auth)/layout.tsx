import { AuthProviders } from "@/components/AuthProviders";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProviders>
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </AuthProviders>
  );
}
