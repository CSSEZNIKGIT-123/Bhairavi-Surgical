'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Rating({
  value = 5,
  max = 5,
  reviewCount = null,
  size = 'sm',
  className = '',
  showNumber = false,
}) {
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5 text-amber-500">
        {[...Array(max)].map((_, i) => {
          const isFilled = i < Math.floor(value);
          return (
            <Star
              key={i}
              className={cn(
                iconSizes[size],
                isFilled ? 'fill-amber-500 text-amber-500' : 'text-amber-300'
              )}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-charcoal">
          {Number(value).toFixed(1)}
        </span>
      )}
      {reviewCount !== null && (
        <span className="text-xs text-charcoal-muted">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
