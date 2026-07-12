import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

type MarketingHeaderProps = {
  active?: "blog" | "features" | "pricing";
};

export function MarketingHeader({ active }: MarketingHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#ebebeb] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo href="/" height={40} />

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#6b6b6b] md:flex">
          <Link
            href="/#features"
            className={`transition hover:text-[#212121] ${active === "features" ? "font-semibold text-[#212121]" : ""}`}
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className={`transition hover:text-[#212121] ${active === "pricing" ? "font-semibold text-[#212121]" : ""}`}
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            className={`transition hover:text-[#212121] ${active === "blog" ? "font-semibold text-[#212121]" : ""}`}
          >
            Blog
          </Link>
          <Link href="/login" className="transition hover:text-[#212121]">
            Sign in
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg border border-[#d1d1d1] px-4 py-2 text-sm font-medium text-[#212121] transition hover:bg-[#fafafa] sm:inline-flex"
          >
            Contact sales
          </Link>
          <Link
            href="/register"
            className="inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Start free trial
          </Link>
        </div>
      </div>
    </header>
  );
}
