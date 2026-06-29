import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "electric" | "muted";
}

export function Badge({
  className,
  variant = "gold",
  ...props
}: BadgeProps) {
  const styles = {
    gold: "border-gold/30 bg-gold/10 text-gold",
    electric: "border-electric/30 bg-electric/10 text-electric",
    muted: "border-white/10 bg-white/5 text-white/70",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
