'use client';

import React from 'react';
import { UserRoleCategory } from '@/lib/rbac/permissions';
import { usePermissions } from '@/lib/rbac/usePermissions';

interface RequireRoleProps {
  allowedRoles: UserRoleCategory[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireRole({ allowedRoles, children, fallback = null }: RequireRoleProps) {
  const { hasRole } = usePermissions();

  if (!hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
