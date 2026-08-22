'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) {
  const variants = {
    default: 'bg-cream-200 text-charcoal-muted border-cream-300',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    forest: 'bg-forest-light/10 text-forest border-forest/20 font-medium',
    terracotta: 'bg-terracotta/10 text-terracotta border-terracotta/30 font-semibold',
    bestseller: 'bg-forest text-white border-forest font-semibold uppercase tracking-wider',
    sale: 'bg-terracotta text-white border-terracotta font-semibold',
    luxury: 'bg-charcoal text-gold-light border-gold/30 font-medium uppercase tracking-widest',
    outline: 'bg-transparent text-charcoal border-charcoal/20',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-lg',
    lg: 'text-sm px-3 py-1.5 rounded-xl',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center border transition-colors',
        variants[variant] || variants.default,
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
