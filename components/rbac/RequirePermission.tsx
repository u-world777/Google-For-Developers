'use client';

import React from 'react';
import { RolePermissions } from '@/lib/rbac/permissions';
import { usePermissions } from '@/lib/rbac/usePermissions';

interface RequirePermissionProps {
  permission: keyof RolePermissions;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequirePermission({ permission, children, fallback = null }: RequirePermissionProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
