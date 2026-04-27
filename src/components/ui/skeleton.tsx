import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Generic shimmer skeleton primitive. Use for placeholder blocks while data
 * is loading. Accepts any width/height via className.
 *
 * Example:
 *   <Skeleton className="h-4 w-32" />
 *   <Skeleton className="h-24 w-full rounded-xl" />
 */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-md bg-slate-200/70 dark:bg-slate-700/40',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite]',
        'before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent',
        'dark:before:via-white/10',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
