'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

/**
 * Mounts a side-effect that mirrors the persisted theme (`useThemeStore`)
 * onto the <html> element as a `dark` class. Tailwind v4 picks this up via
 * the `@custom-variant dark (&:where(.dark, .dark *))` rule in globals.css.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  return <>{children}</>;
}
