'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  /** Render label next to the icon (used inside sidebars). */
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel }: ThemeToggleProps) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  // Avoid hydration mismatch — render the icon only after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';
  const label = isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors',
        'hover:bg-slate-50 hover:text-slate-900',
        'focus-visible:ring-primary/30 focus-visible:ring-2 focus-visible:outline-none',
        'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white',
        className,
      )}
    >
      <span
        aria-hidden
        className="relative inline-flex size-4 items-center justify-center text-amber-500 dark:text-sky-300"
      >
        {mounted ? (
          isDark ? (
            <Moon className="size-4" />
          ) : (
            <Sun className="size-4" />
          )
        ) : (
          <Sun className="size-4 opacity-0" />
        )}
      </span>
      {showLabel ? <span>{isDark ? 'Tối' : 'Sáng'}</span> : null}
    </button>
  );
}
