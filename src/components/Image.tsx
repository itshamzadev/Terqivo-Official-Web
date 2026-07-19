import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackIcon?: React.ReactNode;
}

export default function Image({ 
  src, 
  alt, 
  className, 
  fallbackIcon = <ImageIcon className="w-8 h-8 text-muted-foreground/50" />, 
  ...props 
}: ImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error || !src) {
    return (
      <div className={cn("flex items-center justify-center bg-secondary/50", className)}>
        {fallbackIcon}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-secondary/20", className)}>
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </div>
  );
}
