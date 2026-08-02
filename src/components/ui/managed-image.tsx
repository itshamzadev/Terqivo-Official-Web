import { useState } from "react";
import type { ReactNode } from "react";
import { assetUrl } from "@/src/lib/utils";

interface ManagedImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallback: ReactNode;
  loading?: "eager" | "lazy";
}

export function ManagedImage({ src, alt, className, fallback, loading = "lazy" }: ManagedImageProps) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <>{fallback}</>;
  return <img src={assetUrl(src)} alt={alt} className={className} loading={loading} onError={() => setFailed(true)} />;
}
