import { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full rounded-2xl border border-mint/15 bg-bg800/80 px-5 py-3 text-text100 shadow-glow outline-none transition focus:border-mint/60 focus:ring-2 focus:ring-mint/40 focus:bg-bg900/90',
        props.className,
      )}
    />
  );
}
