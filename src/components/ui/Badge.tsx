type BadgeProps = {
  children: string;
  variant?: "brand" | "neutral";
};

export function Badge({ children, variant = "brand" }: BadgeProps) {
  const styles =
    variant === "brand"
      ? "bg-brand-light text-brand-hover"
      : "bg-paper text-muted border border-border";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}>
      {children}
    </span>
  );
}
