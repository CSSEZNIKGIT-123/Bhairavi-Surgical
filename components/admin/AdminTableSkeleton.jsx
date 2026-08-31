'use client';

import React from 'react';

/**
 * Standard table skeleton loader for light admin tables
 */
export default function AdminTableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div className="w-full animate-pulse divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex items-center justify-between py-4 px-4 gap-4">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div
              key={cIdx}
              className={`h-4 bg-slate-100 rounded ${
                cIdx === 0
                  ? 'w-24'
                  : cIdx === 1
                  ? 'w-48'
                  : cIdx === cols - 1
                  ? 'w-20'
                  : 'w-32'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
