'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export default function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  rows = 4,
  error = null,
  helperText = null,
  required = false,
  disabled = false,
  className = '',
  textareaClassName = '',
  ...props
}) {
  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-semibold text-charcoal tracking-wide">
          {label} {required && <span className="text-terracotta">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        className={cn(
          'w-full bg-white text-charcoal text-sm rounded-xl border border-cream-300 px-4 py-2.5 transition-all duration-200 placeholder:text-charcoal-light/60 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 disabled:bg-cream-100 disabled:cursor-not-allowed resize-y',
          error && 'border-terracotta focus:border-terracotta focus:ring-terracotta/10',
          textareaClassName
        )}
        {...props}
      />
      {error && <p className="text-xs text-terracotta font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-charcoal-light">{helperText}</p>
      )}
    </div>
  );
}
