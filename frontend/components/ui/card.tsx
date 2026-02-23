import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'surface rounded-3xl p-6 shadow-glow border border-mint/10 backdrop-blur-panel transition-all duration-300',
        className,
      )}
    >
      {children}
    </div>
  );
}
