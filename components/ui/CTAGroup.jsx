'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export default function CTAGroup({
  children,
  align = 'left', // 'left', 'center', 'right'
  className = '',
  stackOnMobile = true,
}) {
  const alignmentStyles = {
    left: 'justify-start text-left',
    center: 'justify-center text-center',
    right: 'justify-end text-right',
  };

  return (
    <div
      className={cn(
        'w-full sm:w-auto',
        stackOnMobile
          ? 'flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4'
          : 'flex flex-row items-center gap-3 sm:gap-4 flex-wrap',
        alignmentStyles[align],
        className
      )}
    >
      {children}
    </div>
  );
}
