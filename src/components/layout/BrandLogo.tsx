import { useSettings } from '../SettingsContext';
import { ProgressiveImage } from '../ui/progressive-image';

const defaultLogo = '/brand/terqivo-logo.png';

interface BrandLogoProps {
  size?: 'header' | 'footer';
}

export function BrandLogo({ size = 'header' }: BrandLogoProps) {
  const { settings } = useSettings();
  const companyName = settings?.general?.companyName || 'Terqivo';
  const logoUrl = settings?.branding?.logoUrl;

  if (logoUrl) {
    return (
      <ProgressiveImage
        src={logoUrl}
        alt={companyName}
        frameClassName="inline-flex h-8 w-auto"
        className="h-8 w-auto object-contain"
        loading="eager"
      />
    );
  }

  const markSize = size === 'footer' ? 'h-10 w-10' : 'h-8 w-8';

  return (
    <span className="inline-flex items-center gap-2">
      <img
        src={defaultLogo}
        alt=""
        aria-hidden="true"
        className={`${markSize} object-contain`}
        width={size === 'footer' ? 40 : 32}
        height={size === 'footer' ? 40 : 32}
      />
      <span className="font-heading font-black text-2xl tracking-tighter text-primary">
        {companyName.toUpperCase()}<span className="text-accent">.</span>
      </span>
    </span>
  );
}
