/** Match sidebar link against current pathname (supports nested routes). */
export function isNavLinkActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (!pathname.startsWith(`${href}/`)) return false;
  // Avoid marking /expenses active when on /expenses/upload (separate nav item).
  if (href === "/expenses" && pathname.startsWith("/expenses/upload")) return false;
  if (href === "/bank-accounts" && pathname.startsWith("/bank-accounts/connect")) return false;
  return true;
}
