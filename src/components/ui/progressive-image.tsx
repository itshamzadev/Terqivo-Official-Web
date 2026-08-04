import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { assetUrl, cn } from "@/src/lib/utils";

interface ProgressiveImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  frameClassName?: string;
  fallback?: ReactNode;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}

export function ProgressiveImage({
  src,
  alt,
  className = "",
  frameClassName,
  fallback,
  loading = "lazy",
  fetchPriority,
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  if (!src || failed) return <>{fallback || null}</>;

  return (
    <span className={cn("relative block overflow-hidden", frameClassName || className)}>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 z-0 animate-pulse bg-muted/60 transition-opacity duration-500",
          loaded && "opacity-0",
        )}
      />
      <img
        src={assetUrl(src)}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        className={cn("block transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0", className)}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </span>
  );
}
