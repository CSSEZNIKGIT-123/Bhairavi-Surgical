'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  loading = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold font-poppins transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] leading-none max-w-full text-center';

  const variants = {
    primary:
      'bg-forest hover:bg-forest-dark text-white shadow-sm focus:ring-forest-light border border-forest-dark',
    secondary:
      'bg-cream-100 hover:bg-cream-200 text-charcoal border border-cream-300 focus:ring-brand-400',
    outline:
      'bg-transparent hover:bg-forest/5 text-forest border border-forest focus:ring-forest',
    'outline-white':
      'bg-transparent hover:bg-white/10 text-white border border-white/40 focus:ring-white/50 backdrop-blur-sm',
    'outline-gold':
      'bg-transparent hover:bg-gold/15 text-gold-light border border-gold/40 focus:ring-gold/50 backdrop-blur-sm',
    terracotta:
      'bg-terracotta hover:bg-terracotta-dark text-white shadow-sm focus:ring-terracotta-light',
    luxury:
      'bg-gradient-to-r from-[#1C201D] via-[#2A342B] to-[#1C201D] text-gold-light border border-gold/40 hover:border-gold shadow-md hover:shadow-glow',
    gold:
      'bg-gradient-to-r from-gold via-gold-light to-gold text-slate-950 hover:brightness-105 shadow-glow border border-gold/60 font-bold',
    ghost:
      'bg-transparent hover:bg-black/5 text-charcoal focus:ring-transparent border-transparent',
    white:
      'bg-white hover:bg-cream-100 text-forest font-semibold shadow-soft border border-cream-200',
    dark:
      'bg-charcoal hover:bg-black text-white focus:ring-charcoal',
  };

  const sizes = {
    nav: 'h-9 sm:h-10 text-xs font-semibold px-3 sm:px-4 rounded-xl gap-1.5 sm:gap-2 shrink-0 min-w-fit',
    xs: 'h-8 text-xs px-2.5 sm:px-3 rounded-lg gap-1.5 min-w-fit',
    sm: 'h-9 sm:h-10 text-xs sm:text-sm px-3.5 sm:px-4 rounded-xl gap-2 min-w-fit',
    md: 'h-11 sm:h-12 text-xs sm:text-sm md:text-base px-4 sm:px-6 rounded-xl gap-2 sm:gap-2.5 min-w-fit',
    lg: 'h-12 sm:h-14 text-xs sm:text-sm md:text-base px-4 sm:px-8 rounded-2xl gap-2.5 sm:gap-3 min-w-fit',
    xl: 'h-13 sm:h-16 text-sm sm:text-base md:text-lg px-5 sm:px-10 rounded-2xl gap-3 sm:gap-3.5 min-w-fit',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : 'w-auto',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span className="truncate">{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
