'use client';

import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export default function StatusBadge({ status, variant }: StatusBadgeProps) {
  let appliedVariant = variant;

  if (!appliedVariant) {
    const s = status.toLowerCase();
    if (['completed', 'active', 'recommended', 'approved'].includes(s)) {
      appliedVariant = 'success';
    } else if (['pending', 'submitted', 'requested', 'in progress'].includes(s)) {
      appliedVariant = 'warning';
    } else if (['rejected', 'cancelled', 'error', 'failed', 'not recommended', 'issue'].includes(s)) {
      appliedVariant = 'error';
    } else if (['assigned', 'info'].includes(s)) {
      appliedVariant = 'info';
    } else {
      appliedVariant = 'default';
    }
  }

  const variants = {
    default: 'bg-gray-50 text-gray-700 border-gray-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${variants[appliedVariant]}`}>
      {status}
    </span>
  );
}
