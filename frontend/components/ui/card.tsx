import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-[rgba(27,31,37,0.72)] p-4 backdrop-blur-panel',
        className,
      )}
    >
      {children}
    </div>
  );
}
