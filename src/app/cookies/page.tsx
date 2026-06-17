import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { CookieSettingsLink } from "@/components/CookieSettingsLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { COOKIE_CATEGORIES } from "@/lib/cookies";

export const metadata = {
  title: "Cookie Policy | ExpenseKit",
  description: "Learn how ExpenseKit uses cookies and how to manage your preferences.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-border bg-surface px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Logo href="/" height={36} />
          <Link href="/login" className="text-sm font-semibold text-brand hover:text-brand-hover">
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <PageHeader
          title="Cookie policy"
          subtitle="How ExpenseKit uses cookies and similar technologies"
        />

        <div className="prose prose-neutral mt-8 max-w-none space-y-6 text-sm text-ink">
          <p className="text-muted">
            ExpenseKit uses cookies and local storage to keep you signed in, remember your
            preferences, and improve the product. You can change your choices at any time from
            the cookie banner or your profile.
          </p>

          <section>
            <h2 className="text-lg font-bold text-ink">What we store</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
              <li>
                <strong className="text-ink">Sign-in session</strong> — JWT token and basic account
                info so you stay logged in.
              </li>
              <li>
                <strong className="text-ink">Theme</strong> — light or dark mode preference.
              </li>
              <li>
                <strong className="text-ink">Organization &amp; trial</strong> — selected account and
                guest trial state.
              </li>
              <li>
                <strong className="text-ink">Referral code</strong> — if you arrived via a referral
                link.
              </li>
              <li>
                <strong className="text-ink">Language &amp; currency</strong> — your regional
                preferences from profile settings.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink">Cookie categories</h2>
            <div className="mt-4 space-y-3">
              {COOKIE_CATEGORIES.map((category) => (
                <div key={category.id} className="rounded-xl border border-border bg-surface p-4">
                  <p className="font-semibold text-ink">{category.title}</p>
                  <p className="mt-1 text-muted">{category.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink">Managing cookies</h2>
            <p className="mt-2 text-muted">
              Use the cookie banner when you first visit, or open{" "}
              <CookieSettingsLink /> from any page (including your profile). You can also clear
              site data in your browser, which will sign you out and reset preferences.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink">Contact</h2>
            <p className="mt-2 text-muted">
              Questions about privacy or cookies? Reach us via WhatsApp from the app or email
              support through your account settings.
            </p>
          </section>
        </div>

        <p className="mt-10 text-center text-sm text-muted">
          <Link href="/" className="font-semibold text-brand hover:text-brand-hover">
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
