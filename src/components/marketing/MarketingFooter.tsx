import Link from "next/link";

type MarketingFooterProps = {
  className?: string;
};

export function MarketingFooter({ className = "" }: MarketingFooterProps) {
  return (
    <footer className={`border-t border-[#ebebeb] py-10 ${className}`.trim()}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-[#9b9b9b] sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} ExpenseKit</p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/pricing" className="hover:text-[#212121]">
            Pricing
          </Link>
          <Link href="/blog" className="hover:text-[#212121]">
            Blog
          </Link>
          <Link href="/login" className="hover:text-[#212121]">
            Sign in
          </Link>
          <Link href="/register" className="hover:text-[#212121]">
            Register
          </Link>
          <Link href="/cookies" className="hover:text-[#212121]">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
}
