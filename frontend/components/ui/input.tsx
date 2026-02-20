import { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full rounded-xl border border-white/20 bg-bg800/70 px-4 py-3 text-text100 outline-none transition focus:border-mint/60 focus:ring-2 focus:ring-mint/40',
        props.className,
      )}
    />
  );
}
