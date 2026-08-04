import { Link } from 'react-router-dom';
import { useSettings } from '../SettingsContext';
import { ProgressiveImage } from '../ui/progressive-image';

export function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="border-t bg-secondary/30 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
              {settings?.branding?.logoUrl ? (
                <ProgressiveImage src={settings.branding.logoUrl} alt={settings.general.companyName} frameClassName="inline-flex h-8 w-auto" className="h-8 w-auto object-contain" loading="eager" />
              ) : (
                <span className="font-heading font-black text-2xl tracking-tighter text-primary">
                  {settings?.general?.companyName?.toUpperCase() || 'TERQIVO'}<span className="text-accent">.</span>
                </span>
              )}
            </Link>
            <p className="text-base text-muted-foreground font-sans max-w-sm whitespace-pre-line">
              {settings?.footer?.description || settings?.general?.companyDescription}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {settings?.social?.twitter && (
                <a href={settings.social.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.976H5.078z" />
                  </svg>
                </a>
              )}
              {settings?.social?.linkedin && (
                <a href={settings.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-6 font-heading text-foreground">Company</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-accent transition-colors">About Terqivo</Link></li>
              <li><Link to="/about/ceo" className="text-muted-foreground hover:text-accent transition-colors">Leadership</Link></li>
              <li><Link to="/jobs" className="text-muted-foreground hover:text-accent transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-6 font-heading text-foreground">Explore</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-accent transition-colors">Solutions</Link></li>
              <li><Link to="/products" className="text-muted-foreground hover:text-accent transition-colors">Products</Link></li>
              <li><Link to="/courses" className="text-muted-foreground hover:text-accent transition-colors">Courses</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-accent transition-colors">Insights</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {settings?.footer?.copyrightText || '© 2026 Terqivo. All rights reserved.'}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-accent transition-colors">Terms of Service</Link>
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-accent transition-colors">Cookie Policy</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-accent transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
