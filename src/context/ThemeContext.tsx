import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('terqivo-theme-v2');
  }, [theme]);

  const value = useMemo(() => ({
    theme: 'light' as Theme,
    setTheme: (_nextTheme: Theme) => setThemeState('light'),
    toggleTheme: () => setThemeState('light'),
  }), []);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
