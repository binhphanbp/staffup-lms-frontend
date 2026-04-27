'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Optional accessible label for the dialog. */
  ariaLabel?: string;
  /** Width class. Defaults to `max-w-lg`. */
  widthClassName?: string;
  /** Disable click-outside-to-close. */
  disableBackdropClose?: boolean;
}

/**
 * Lightweight animated modal wrapper. Handles:
 *   - backdrop fade in/out
 *   - panel scale + slide-up enter, fade out exit (Framer Motion)
 *   - Escape key to close
 *   - body scroll lock while open
 *   - focus trap (basic — focus first interactive element on open)
 *
 * Pages can compose their existing form/content as the children. Replaces
 * hand-rolled `fixed inset-0` modal scaffolding scattered across the app.
 */
export function Dialog({
  open,
  onClose,
  children,
  ariaLabel,
  widthClassName = 'max-w-lg',
  disableBackdropClose,
}: DialogProps) {
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Focus the first interactive element after mount.
    const t = window.setTimeout(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>(
        'input, textarea, select, button, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }, 50);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="dialog-backdrop"
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={() => {
            if (!disableBackdropClose) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
        >
          <motion.div
            key="dialog-panel"
            ref={panelRef}
            className={cn(
              'relative w-full overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700',
              widthClassName,
            )}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
