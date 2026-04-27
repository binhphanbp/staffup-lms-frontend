'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

const DISMISS_KEY = 'staffup-pwa-install-dismissed-at';
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPromptBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Already running as standalone PWA → never show.
    const matchStandalone = window.matchMedia?.('(display-mode: standalone)').matches;
    const iosStandalone = (window.navigator as { standalone?: boolean }).standalone === true;
    if (matchStandalone || iosStandalone) return;

    try {
      const dismissedAt = Number(window.localStorage.getItem(DISMISS_KEY) ?? 0);
      if (dismissedAt && Date.now() - dismissedAt < DISMISS_TTL_MS) return;
    } catch {
      // localStorage may throw in private mode → treat as not dismissed
    }

    const handler = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  };

  const install = async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === 'dismissed') {
        dismiss();
      } else {
        setVisible(false);
      }
    } catch {
      dismiss();
    } finally {
      setDeferred(null);
    }
  };

  if (!visible || !deferred) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="pwa-install-title"
      className="pointer-events-auto fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg md:right-4 md:bottom-4 md:left-auto md:mx-0 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
        <Download className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p
          id="pwa-install-title"
          className="text-sm font-semibold text-slate-900 dark:text-slate-50"
        >
          Cài StaffUp lên thiết bị?
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          Mở nhanh như app, học được cả khi không có mạng nhờ bài học đã lưu offline.
        </p>
        <div className="mt-2.5 flex items-center gap-2">
          <button
            type="button"
            onClick={install}
            className="bg-primary hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white shadow-sm transition"
          >
            <Download className="size-3.5" />
            Cài app
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Để sau
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Đóng"
        className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
