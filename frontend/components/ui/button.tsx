import { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const variantClasses = {
  primary: 'bg-mint text-bg900 hover:brightness-110 shadow-glow',
  secondary: 'bg-gold/15 text-text100 border border-gold/45 hover:bg-gold/25',
  ghost: 'bg-transparent text-text100 hover:bg-white/10 border border-white/10',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
}

export function Button({ className, variant = 'primary', ...props }: Props) {
  return (
    <button
      className={cn(
        'rounded-2xl px-5 py-3 text-base font-semibold shadow-glow transition duration-200 ease-out hover-lift focus:outline-none focus:ring-2 focus:ring-mint/40 disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
