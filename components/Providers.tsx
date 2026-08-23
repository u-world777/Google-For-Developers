'use client';

import React from 'react';
import { GovernanceProvider } from '@/lib/governance-context';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GovernanceProvider>
      {children}
    </GovernanceProvider>
  );
}
