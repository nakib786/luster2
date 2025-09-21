'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type UserTheme = 'light' | 'dark'; // Only these are user-selectable

interface ThemeContextType {
  theme: UserTheme | 'system'; // Internal: can be system, but user only sees light/dark
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: UserTheme) => void;
  toggleTheme: () => void;
  isSystemMode: boolean; // Helper to know if we're in system mode
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get theme from localStorage if it exists
    const storedTheme = localStorage.getItem('luster-theme') as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // If no stored theme, default to system mode
      setTheme('system');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    let newEffectiveTheme: 'light' | 'dark';

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      newEffectiveTheme = systemTheme;
    } else {
      newEffectiveTheme = theme;
    }

    // Apply theme class to root element
    root.classList.add(newEffectiveTheme);
    setEffectiveTheme(newEffectiveTheme);

    // Store theme preference
    localStorage.setItem('luster-theme', theme);
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      setEffectiveTheme(systemTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const toggleTheme = () => {
    if (theme === 'system') {
      // If in system mode, toggle to the opposite of current effective theme
      setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const setUserTheme = (userTheme: UserTheme) => {
    setTheme(userTheme);
  };

  const value = {
    theme,
    effectiveTheme,
    setTheme: setUserTheme,
    toggleTheme,
    isSystemMode: theme === 'system',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
