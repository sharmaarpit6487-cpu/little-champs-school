import Image from "next/image";
import { cn } from "@/lib/utils";
import { SCHOOL_IMAGES } from "@/lib/school-images";

interface SchoolLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  priority?: boolean;
}

export function SchoolLogo({
  className,
  size = "md",
  showText = true,
  priority = false,
}: SchoolLogoProps) {
  const sizes = {
    sm: {
      logo: "h-9 w-auto",
      title: "text-xs sm:text-sm",
      tag: "text-[10px] sm:text-xs",
    },
    md: {
      logo: "h-11 w-auto sm:h-12",
      title: "text-sm sm:text-base",
      tag: "text-[11px] sm:text-xs",
    },
    lg: {
      logo: "h-12 w-auto sm:h-14",
      title: "text-base sm:text-lg",
      tag: "text-xs sm:text-sm",
    },
  };
  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5 sm:gap-3", className)}>
      <Image
        src={SCHOOL_IMAGES.logo}
        alt="Little Champs School logo"
        width={160}
        height={56}
        priority={priority}
        className={cn(s.logo, "object-contain drop-shadow-sm shrink-0")}
      />
      {showText && (
        <div className="flex flex-col justify-center min-w-0 leading-none gap-px">
          <span
            className={cn(
              "font-display font-bold text-slate-800 dark:text-white leading-[1.1] tracking-tight",
              s.title
            )}
          >
            Little Champs
          </span>
          <span
            className={cn(
              "font-display font-semibold text-brand-blue leading-[1.1] tracking-tight",
              s.tag
            )}
          >
            School
          </span>
        </div>
      )}
    </div>
  );
}
