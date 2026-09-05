import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { IMAGE_BLUR } from "@/lib/school-images";

interface SchoolImageProps extends Omit<ImageProps, "placeholder" | "blurDataURL"> {
  hover?: boolean;
  rounded?: boolean;
}

export function SchoolImage({
  className,
  hover = false,
  rounded = true,
  alt,
  ...props
}: SchoolImageProps) {
  return (
    <Image
      alt={alt}
      placeholder="blur"
      blurDataURL={IMAGE_BLUR}
      className={cn(
        "object-cover",
        rounded && "rounded-3xl",
        hover && "transition-transform duration-500 ease-out hover:scale-[1.03]",
        className
      )}
      {...props}
    />
  );
}
