/**
 * Centralized toast helpers — wraps `sonner` with the project's preferred
 * Vietnamese-first defaults. Pages should `import { toast } from '@/lib/toast'`
 * instead of using `alert()` or per-page toast state.
 */
import { toast as sonnerToast } from 'sonner';

type ToastOptions = {
  description?: string;
  duration?: number;
};

export const toast = {
  success: (message: string, opts: ToastOptions = {}) =>
    sonnerToast.success(message, {
      description: opts.description,
      duration: opts.duration,
    }),
  error: (message: string, opts: ToastOptions = {}) =>
    sonnerToast.error(message, {
      description: opts.description,
      duration: opts.duration ?? 5000,
    }),
  info: (message: string, opts: ToastOptions = {}) =>
    sonnerToast.info(message, {
      description: opts.description,
      duration: opts.duration,
    }),
  warning: (message: string, opts: ToastOptions = {}) =>
    sonnerToast.warning(message, {
      description: opts.description,
      duration: opts.duration,
    }),
  loading: (message: string, opts: ToastOptions = {}) =>
    sonnerToast.loading(message, {
      description: opts.description,
    }),
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
  promise: sonnerToast.promise,
};
