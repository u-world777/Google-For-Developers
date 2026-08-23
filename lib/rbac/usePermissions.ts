import { useGovernance } from '../governance-context';
import { 
  UserRoleCategory, 
  RolePermissions, 
  ROLE_PERMISSIONS, 
  ADMIN_SIDEBAR_TABS, 
  AdminSidebarTabConfig 
} from './permissions';

export function usePermissions(customRole?: UserRoleCategory) {
  const { activeRole: contextRole, currentMember } = useGovernance();

  // Active role derived from context or current selected member
  const activeRole: UserRoleCategory = customRole || 
    (currentMember?.role as UserRoleCategory) || 
    (contextRole as UserRoleCategory) || 
    'MP';

  const isAdmin = activeRole === 'MP'; // MP acts as System Superuser Admin
  const basePermissions: RolePermissions = ROLE_PERMISSIONS[activeRole] || ROLE_PERMISSIONS.MP;

  const hasRole = (allowedRoles: UserRoleCategory[]): boolean => {
    if (isAdmin) return true; // Superuser Admin has full access to all role features
    return allowedRoles.includes(activeRole);
  };

  const hasPermission = (permissionKey: keyof RolePermissions): boolean => {
    if (isAdmin) return true; // Superuser Admin has all privileges
    return !!basePermissions[permissionKey];
  };

  const isTabAccessible = (tabId: AdminSidebarTabConfig['id']): boolean => {
    if (isAdmin) return true; // Superuser Admin can access all tabs
    const tabConfig = ADMIN_SIDEBAR_TABS.find(t => t.id === tabId);
    if (!tabConfig) return true;
    
    if (tabConfig.allowedRoles && !tabConfig.allowedRoles.includes(activeRole)) {
      return false;
    }
    
    if (tabConfig.requiredPermission && !basePermissions[tabConfig.requiredPermission]) {
      return false;
    }

    return true;
  };

  const accessibleTabs = ADMIN_SIDEBAR_TABS.filter(tab => isTabAccessible(tab.id));

  return {
    activeRole,
    isAdmin,
    permissions: isAdmin 
      ? {
          canViewExecutiveDashboard: true,
          canManageStaffRoster: true,
          canApproveFundSanctions: true,
          canEditInfrastructureProjects: true,
          canIssueShowCauseDirectives: true,
          canVerifyWardPetitions: true,
          canViewBudgetPlanner: true,
          canViewAnalytics: true,
          canManageSystemSettings: true,
          canAccessWhatsAppHelpline: true,
          canAccessVoiceAssistant: true
        }
      : basePermissions,
    hasRole,
    hasPermission,
    isTabAccessible,
    accessibleTabs
  };
}
