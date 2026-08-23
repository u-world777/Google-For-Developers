export type UserRoleCategory = 'MP' | 'COLLECTOR' | 'ENGINEER' | 'COUNCILLOR' | 'NODAL_OFFICER';

export interface RolePermissions {
  canViewExecutiveDashboard: boolean;
  canManageStaffRoster: boolean;
  canApproveFundSanctions: boolean;
  canEditInfrastructureProjects: boolean;
  canIssueShowCauseDirectives: boolean;
  canVerifyWardPetitions: boolean;
  canViewBudgetPlanner: boolean;
  canViewAnalytics: boolean;
  canManageSystemSettings: boolean;
  canAccessWhatsAppHelpline: boolean;
  canAccessVoiceAssistant: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRoleCategory, RolePermissions> = {
  MP: {
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
  },
  COLLECTOR: {
    canViewExecutiveDashboard: true,
    canManageStaffRoster: true,
    canApproveFundSanctions: false,
    canEditInfrastructureProjects: true,
    canIssueShowCauseDirectives: true,
    canVerifyWardPetitions: true,
    canViewBudgetPlanner: true,
    canViewAnalytics: true,
    canManageSystemSettings: false,
    canAccessWhatsAppHelpline: true,
    canAccessVoiceAssistant: true
  },
  ENGINEER: {
    canViewExecutiveDashboard: false,
    canManageStaffRoster: true,
    canApproveFundSanctions: false,
    canEditInfrastructureProjects: true,
    canIssueShowCauseDirectives: false,
    canVerifyWardPetitions: false,
    canViewBudgetPlanner: true,
    canViewAnalytics: true,
    canManageSystemSettings: false,
    canAccessWhatsAppHelpline: true,
    canAccessVoiceAssistant: true
  },
  COUNCILLOR: {
    canViewExecutiveDashboard: false,
    canManageStaffRoster: true,
    canApproveFundSanctions: false,
    canEditInfrastructureProjects: false,
    canIssueShowCauseDirectives: false,
    canVerifyWardPetitions: true,
    canViewBudgetPlanner: true,
    canViewAnalytics: false,
    canManageSystemSettings: false,
    canAccessWhatsAppHelpline: true,
    canAccessVoiceAssistant: true
  },
  NODAL_OFFICER: {
    canViewExecutiveDashboard: false,
    canManageStaffRoster: false,
    canApproveFundSanctions: false,
    canEditInfrastructureProjects: false,
    canIssueShowCauseDirectives: false,
    canVerifyWardPetitions: true,
    canViewBudgetPlanner: false,
    canViewAnalytics: false,
    canManageSystemSettings: false,
    canAccessWhatsAppHelpline: true,
    canAccessVoiceAssistant: true
  }
};

export interface AdminSidebarTabConfig {
  id: 'DASHBOARD' | 'MEMBERS' | 'COMPLAINTS' | 'PROJECTS' | 'AUDIT' | 'SETTINGS';
  label: string;
  allowedRoles: UserRoleCategory[];
  requiredPermission?: keyof RolePermissions;
}

export const ADMIN_SIDEBAR_TABS: AdminSidebarTabConfig[] = [
  {
    id: 'DASHBOARD',
    label: 'Executive Overview',
    allowedRoles: ['MP', 'COLLECTOR'],
    requiredPermission: 'canViewExecutiveDashboard'
  },
  {
    id: 'MEMBERS',
    label: 'Governance Staff Roster',
    allowedRoles: ['MP', 'COLLECTOR', 'ENGINEER', 'COUNCILLOR'],
    requiredPermission: 'canManageStaffRoster'
  },
  {
    id: 'COMPLAINTS',
    label: 'Grievances & Petitions',
    allowedRoles: ['MP', 'COLLECTOR', 'ENGINEER', 'COUNCILLOR', 'NODAL_OFFICER']
  },
  {
    id: 'PROJECTS',
    label: 'Infrastructure Projects',
    allowedRoles: ['MP', 'COLLECTOR', 'ENGINEER'],
    requiredPermission: 'canEditInfrastructureProjects'
  },
  {
    id: 'AUDIT',
    label: 'Audit & Telemetry Logs',
    allowedRoles: ['MP', 'COLLECTOR', 'ENGINEER']
  },
  {
    id: 'SETTINGS',
    label: 'System & API Settings',
    allowedRoles: ['MP'],
    requiredPermission: 'canManageSystemSettings'
  }
];
