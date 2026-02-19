import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-[rgba(20,30,52,0.58)] p-4 backdrop-blur-panel',
        className,
      )}
    >
      {children}
    </div>
  );
}
