import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12",
        align === "center" && "text-center",
        className
      )}
    >
      {subtitle && (
        <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-2">
          {subtitle}
        </p>
      )}
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
          {description}
        </p>
      )}
      <div
        className={cn(
          "mt-4 h-1 w-20 bg-gold rounded-full",
          align === "center" && "mx-auto"
        )}
      />
    </div>
  );
}
