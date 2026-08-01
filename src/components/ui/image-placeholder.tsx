import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface ImagePlaceholderProps {
  title: string;
  description?: string;
  className?: string;
}

export function ImagePlaceholder({ 
  title, 
  description = "Final branded visual will be added later.", 
  className 
}: ImagePlaceholderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-6 text-center bg-muted/30 border border-border rounded-[24px]", className)}>
      <ImageIcon className="w-10 h-10 text-muted-foreground/50 mb-4" />
      <h4 className="text-lg font-heading font-semibold text-foreground mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground max-w-[250px]">{description}</p>
    </div>
  );
}
