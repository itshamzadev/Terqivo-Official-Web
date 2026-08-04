import type { ReactNode } from "react";
import { ProgressiveImage } from "./progressive-image";

interface ManagedImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallback: ReactNode;
  loading?: "eager" | "lazy";
}

export function ManagedImage({ src, alt, className, fallback, loading = "lazy" }: ManagedImageProps) {
  return <ProgressiveImage src={src} alt={alt} className={className} frameClassName={className} fallback={fallback} loading={loading} />;
}
