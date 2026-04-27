import * as React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps extends React.ComponentProps<'div'> {
  /** Icon node (Lucide icon component, FA <i>, or any ReactNode). */
  icon?: React.ReactNode;
  /** Primary headline shown bold. */
  title: string;
  /** Optional secondary description. */
  description?: string;
  /** Optional CTA — usually a `<Button>` or `<Link>`. */
  action?: React.ReactNode;
  /** Visual variant. `compact` reduces padding for inline use. */
  variant?: 'default' | 'compact';
}

/**
 * Empty state slot — used when a list/grid has no data. Pairs with `<Skeleton>`
 * (loading) and the actual data state.
 *
 * Example:
 *   <EmptyState
 *     icon={<BookOpen className="size-10" />}
 *     title="Chưa có khóa học nào"
 *     description="Tạo khóa học đầu tiên để học viên có thể đăng ký."
 *     action={<Button>Tạo khóa học</Button>}
 *   />
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-center',
        'rounded-2xl border border-dashed border-slate-300 bg-slate-50/50',
        'dark:border-slate-700 dark:bg-slate-900/30',
        variant === 'default' ? 'px-6 py-12 sm:py-16' : 'px-4 py-6',
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {icon}
        </div>
      ) : null}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-sm text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
