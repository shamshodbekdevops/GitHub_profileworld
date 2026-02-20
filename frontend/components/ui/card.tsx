import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'surface rounded-2xl p-4 backdrop-blur-panel',
        className,
      )}
    >
      {children}
    </div>
  );
}
