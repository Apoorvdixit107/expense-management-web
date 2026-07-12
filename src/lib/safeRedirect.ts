/**
 * Allow only same-app relative paths for post-login redirects.
 * Blocks open redirects: https://evil, //evil, /\evil, javascript:, etc.
 */
export function safeInternalPath(raw: string | null | undefined): string | null {
  if (!raw) return null;

  let path = raw.trim();
  try {
    path = decodeURIComponent(path);
  } catch {
    return null;
  }
  path = path.trim();

  if (!path.startsWith("/")) return null;
  if (path.startsWith("//") || path.startsWith("/\\")) return null;
  if (path.includes("://")) return null;
  if (/^[\\/]{2,}/.test(path)) return null;
  if (/[\0\r\n]/.test(path)) return null;

  // Reject scheme-like prefixes after the leading slash (e.g. /javascript:...)
  const withoutSlash = path.slice(1);
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(withoutSlash)) return null;

  return path;
}
