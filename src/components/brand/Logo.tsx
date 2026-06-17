import Image from "next/image";
import Link from "next/link";

/** Full logo asset aspect ratio (1536×1024). */
const LOGO_ASPECT = 1.5;

type LogoProps = {
  href?: string | null;
  height?: number;
  className?: string;
  onClick?: () => void;
  /** Light padded frame — use on dark backgrounds (sidebar). */
  framed?: boolean;
};

export function Logo({
  href = "/",
  height = 44,
  className = "",
  onClick,
  framed = false,
}: LogoProps) {
  const width = Math.round(height * LOGO_ASPECT);

  const image = (
    <Image
      src="/brand/logo.png"
      alt="ExpenseKit"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      priority
    />
  );

  const content = framed ? (
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
