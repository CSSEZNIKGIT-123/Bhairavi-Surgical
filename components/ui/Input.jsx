'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = null,
  helperText = null,
  icon: Icon = null,
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-semibold text-charcoal tracking-wide flex items-center justify-between">
          <span>
            {label} {required && <span className="text-terracotta">*</span>}
          </span>
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-charcoal-light pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={effectiveType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full bg-white text-charcoal text-sm rounded-xl border border-cream-300 px-4 py-2.5 transition-all duration-200 placeholder:text-charcoal-light/60 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 disabled:bg-cream-100 disabled:cursor-not-allowed',
            Icon && 'pl-10',
            isPassword && 'pr-10',
            error && 'border-terracotta focus:border-terracotta focus:ring-terracotta/10',
            inputClassName
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-charcoal-light hover:text-charcoal p-0.5 rounded focus:outline-none transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-terracotta font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-charcoal-light">{helperText}</p>
      )}
    </div>
  );
}
