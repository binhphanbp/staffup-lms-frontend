'use client';

import { Toaster } from 'sonner';
import { useThemeStore } from '@/store/useThemeStore';

export function ToastProvider() {
  const theme = useThemeStore((s) => s.theme);

  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand
      duration={3500}
      theme={theme}
      toastOptions={{
        classNames: {
          toast:
            'group/toast border border-border bg-card text-card-foreground shadow-lg backdrop-blur',
          title: 'text-sm font-semibold',
          description: 'text-xs text-muted-foreground',
        },
      }}
    />
  );
}
