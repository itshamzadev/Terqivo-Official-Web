import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SiteSettings {
  general: {
    companyName: string;
    companyTagline: string;
    companyDescription: string;
    companyType: string;
    portfolioUrl: string;
  };
  contact: {
    email: string;
    phone: string;
    locationLabel: string;
    locationDescription: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    linkLabel: string;
    linkUrl: string;
    openInNewTab: boolean;
  };
  branding: {
    logoUrl: string;
    faviconUrl: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    ogImageUrl: string;
  };
  footer: {
    description: string;
    copyrightText: string;
  };
  social: {
    linkedin: string;
    github: string;
    youtube: string;
    twitter: string;
    facebook: string;
    instagram: string;
  };
  courseContact: {
    courseWhatsAppEnabled: boolean;
    courseWhatsAppNumber: string;
    courseWhatsAppMessage: string;
  };
}

const defaultSettings: SiteSettings = {
  general: {
    companyName: 'Terqivo',
    companyTagline: 'Building intelligent software, AI-powered products, and secure digital systems.',
    companyDescription: 'Terqivo builds intelligent software, AI-powered products, and secure digital systems.',
    companyType: 'Remote-First Company',
    portfolioUrl: 'https://itshamzadev.com'
  },
  contact: {
    email: 'hello@terqivo.com',
    phone: '+92 370 812 1767',
    locationLabel: 'Remote-First Company',
    locationDescription: 'Serving clients worldwide.'
  },
  announcement: {
    enabled: true,
    text: 'Building intelligent software, AI-powered products, and secure digital systems.',
    linkLabel: 'Learn more →',
    linkUrl: '/services',
    openInNewTab: false
  },
  branding: {
    logoUrl: '',
    faviconUrl: ''
  },
  seo: {
    defaultTitle: 'Terqivo — AI, Software and Intelligent Digital Products',
    defaultDescription: 'Terqivo builds AI-powered products, modern software platforms, business automation systems, and secure digital solutions.',
    ogImageUrl: ''
  },
  footer: {
    description: 'Terqivo builds intelligent software, AI-powered products, and secure digital systems.',
    copyrightText: '© 2026 Terqivo. All rights reserved.'
  },
  social: {
    linkedin: '', github: '', youtube: '', twitter: '', facebook: '', instagram: ''
  },
  courseContact: {
    courseWhatsAppEnabled: false,
    courseWhatsAppNumber: '',
    courseWhatsAppMessage: 'Hello Terqivo, I want details about the {courseTitle} course.'
  }
};

interface SettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  refreshSettings: async () => {},
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings/public');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const json = await res.json();
      const data = json.data;
      if (data) {
        setSettings({
          ...defaultSettings,
          ...data
        });
        
        // Update favicon if set
        if (data.branding?.faviconUrl) {
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = data.branding.faviconUrl;
        }

        // Update basic SEO
        if (data.seo?.defaultTitle) {
          document.title = data.seo.defaultTitle;
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
