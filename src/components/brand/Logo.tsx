import Image from "next/image";
import Link from "next/link";

const SOURCES = {
  full: { src: "/brand/logo.png", aspect: 1.5 },
  transparent: { src: "/brand/logo-transparent.png", aspect: 1.5 },
  icon: { src: "/brand/logo-icon.png", aspect: 1 },
} as const;

export type LogoVariant = keyof typeof SOURCES;

type LogoProps = {
  href?: string | null;
  height?: number;
  className?: string;
  onClick?: () => void;
  /** @deprecated Use variant="sidebar" instead */
  framed?: boolean;
  variant?: LogoVariant;
  /** Show wordmark beside icon (sidebar). */
  showWordmark?: boolean;
};

export function Logo({
  href = "/",
  height = 44,
  className = "",
  onClick,
  framed = false,
  variant = "full",
  showWordmark = false,
}: LogoProps) {
  const resolvedVariant = framed ? "full" : variant;
  const { src, aspect } = SOURCES[resolvedVariant];
  const width = Math.round(height * aspect);

  const image = (
    <Image
      src={src}
      alt="ExpenseKit"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      priority
    />
  );

  const content =
    showWordmark && resolvedVariant === "icon" ? (
      <span className="inline-flex items-center gap-2.5">
        {image}
        <span className="text-base font-bold text-white">ExpenseKit</span>
      </span>
    ) : framed ? (
      <span className="inline-flex rounded-xl bg-white px-2 py-1.5 shadow-sm">{image}</span>
    ) : (
      image
    );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="inline-block shrink-0">
        {content}
      </Link>
    );
  }

  return content;
}
