'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  error = null,
  helperText = null,
  required = false,
  disabled = false,
  className = '',
  selectClassName = '',
  placeholder = 'Select an option',
  ...props
}) {
  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-semibold text-charcoal tracking-wide">
          {label} {required && <span className="text-terracotta">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full bg-white text-charcoal text-sm rounded-xl border border-cream-300 px-4 py-2.5 pr-10 appearance-none transition-all duration-200 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 disabled:bg-cream-100 disabled:cursor-not-allowed',
            error && 'border-terracotta focus:border-terracotta focus:ring-terracotta/10',
            selectClassName
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option
              key={opt.value ?? opt}
              value={opt.value ?? opt}
              className="py-1"
            >
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-charcoal-light absolute right-3.5 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-terracotta font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-charcoal-light">{helperText}</p>
      )}
    </div>
  );
}
