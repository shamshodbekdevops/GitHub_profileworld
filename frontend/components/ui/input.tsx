import { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full rounded-xl border border-white/20 bg-bg800/70 px-4 py-3 text-text100 outline-none ring-cyan transition focus:border-cyan/60 focus:ring-2 focus:ring-cyan/40',
        props.className,
      )}
    />
  );
}
