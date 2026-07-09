type BadgeProps = {
  children: string;
  variant?: "brand" | "neutral" | "draft" | "pending" | "posted" | "rejected";
};

const VARIANT_STYLES: Record<NonNullable<BadgeProps["variant"]>, string> = {
  brand: "bg-brand-light text-brand-hover",
  neutral: "bg-paper text-muted border border-border",
  draft: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200",
  posted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-200",
};

export function Badge({ children, variant = "brand" }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${VARIANT_STYLES[variant]}`}>
      {children}
    </span>
  );
}
