import { apiFetch } from '../lib/api';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface SettingsContextType {
  general: any;
  seo: any;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  general: {},
  seo: {},
  loading: true
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [general, setGeneral] = useState<any>({});
  const [seo, setSeo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [genRes, seoRes] = await Promise.all([
          apiFetch('/api/public/settings/general'),
          apiFetch('/api/public/settings/seo')
        ]);
        
        if (genRes.ok) {
          const genData = await genRes.json();
          if (Object.keys(genData).length > 0) setGeneral(genData);
        }
        
        if (seoRes.ok) {
          const seoData = await seoRes.json();
          if (Object.keys(seoData).length > 0) setSeo(seoData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  useEffect(() => {
    if (seo.defaultTitle) {
      document.title = seo.defaultTitle;
    }
  }, [seo.defaultTitle]);

  const value = React.useMemo(() => ({ general, seo, loading }), [general, seo, loading]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
