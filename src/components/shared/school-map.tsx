import { SCHOOL_INFO } from "@/lib/school-data";

interface SchoolMapProps {
  className?: string;
  minHeight?: number;
}

export function SchoolMap({ className, minHeight = 320 }: SchoolMapProps) {
  return (
    <iframe
      title="Little Champs School Location"
      src={SCHOOL_INFO.mapsEmbedUrl}
      width="100%"
      height="100%"
      className={className}
      style={{ border: 0, minHeight }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
