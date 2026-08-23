import useSWR, { mutate } from 'swr';
import { GovernanceMember, Grievance, ProjectData } from '../constituency-data';
import { AuditLogEntry } from '../persistent-db';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API fetch error on ${url}: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data;
};

export const API_ENDPOINTS = {
  MEMBERS: '/api/members',
  GRIEVANCES: '/api/grievances',
  PROJECTS: '/api/projects',
  AUDIT_LOGS: '/api/audit-logs'
};

// SWR Options for real-time background auto-polling and multi-tab synchronization
const SWR_CONFIG = {
  refreshInterval: 3000, // Background auto-polling every 3 seconds
  revalidateOnFocus: true, // Auto revalidate when user switches tabs/focuses window
  revalidateOnReconnect: true, // Auto revalidate on network reconnection
  dedupingInterval: 2000 // Deduplicate requests within 2s window
};

// 1. Shared Hook for Members
export function useGovernanceMembers() {
  const { data, error, isLoading, mutate: mutateMembers } = useSWR<GovernanceMember[]>(
    API_ENDPOINTS.MEMBERS,
    fetcher,
    SWR_CONFIG
  );

  return {
    members: data || [],
    isLoading,
    isError: !!error,
    mutateMembers
  };
}

// 2. Shared Hook for Grievances
export function useGovernanceGrievances() {
  const { data, error, isLoading, mutate: mutateGrievances } = useSWR<Grievance[]>(
    API_ENDPOINTS.GRIEVANCES,
    fetcher,
    SWR_CONFIG
  );

  return {
    grievances: data || [],
    isLoading,
    isError: !!error,
    mutateGrievances
  };
}

// 3. Shared Hook for Projects
export function useGovernanceProjects() {
  const { data, error, isLoading, mutate: mutateProjects } = useSWR<ProjectData[]>(
    API_ENDPOINTS.PROJECTS,
    fetcher,
    SWR_CONFIG
  );

  return {
    projects: data || [],
    isLoading,
    isError: !!error,
    mutateProjects
  };
}

// 4. Shared Hook for Audit Logs
export function useGovernanceAuditLogs() {
  const { data, error, isLoading, mutate: mutateAuditLogs } = useSWR<AuditLogEntry[]>(
    API_ENDPOINTS.AUDIT_LOGS,
    fetcher,
    SWR_CONFIG
  );

  return {
    auditLogs: data || [],
    isLoading,
    isError: !!error,
    mutateAuditLogs
  };
}

// 5. Global Unified Real-time Synchronization Hook
export function useGovernanceData() {
  const { members, isLoading: membersLoading, isError: membersError } = useGovernanceMembers();
  const { grievances, isLoading: grievancesLoading, isError: grievancesError } = useGovernanceGrievances();
  const { projects, isLoading: projectsLoading, isError: projectsError } = useGovernanceProjects();
  const { auditLogs, isLoading: auditLogsLoading, isError: auditLogsError } = useGovernanceAuditLogs();

  // Global Mutation Utility for Adding a Member
  const addMember = async (memberData: Omit<GovernanceMember, 'id' | 'status' | 'joinedDate'>) => {
    try {
      const res = await fetch(API_ENDPOINTS.MEMBERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      const result = await res.json();
      if (result.success && result.data) {
        // Trigger global mutations across SWR cache
        await Promise.all([
          mutate(API_ENDPOINTS.MEMBERS),
          mutate(API_ENDPOINTS.AUDIT_LOGS)
        ]);
        return result.data;
      }
    } catch (err) {
      console.error('Failed to execute addMember mutation:', err);
      throw err;
    }
  };

  // Global Mutation Utility for Removing a Member
  const removeMember = async (id: string) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.MEMBERS}?id=${id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.success) {
        // Trigger global mutations across SWR cache
        await Promise.all([
          mutate(API_ENDPOINTS.MEMBERS),
          mutate(API_ENDPOINTS.AUDIT_LOGS)
        ]);
        return result.data;
      }
    } catch (err) {
      console.error('Failed to execute removeMember mutation:', err);
      throw err;
    }
  };

  // Global Mutation Utility for Updating Grievance Status
  const updateGrievanceStatus = async (ticketId: string, status: Grievance['status'], officer?: string) => {
    try {
      const res = await fetch(API_ENDPOINTS.GRIEVANCES, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, status, officerInCharge: officer })
      });
      const result = await res.json();
      if (result.success) {
        await Promise.all([
          mutate(API_ENDPOINTS.GRIEVANCES),
          mutate(API_ENDPOINTS.AUDIT_LOGS)
        ]);
        return result.data;
      }
    } catch (err) {
      console.error('Failed to execute updateGrievanceStatus mutation:', err);
      throw err;
    }
  };

  // Global Mutation Utility for Updating Project Progress
  const updateProjectProgress = async (id: string, progressPercentage: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.PROJECTS, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, progressPercentage })
      });
      const result = await res.json();
      if (result.success) {
        await Promise.all([
          mutate(API_ENDPOINTS.PROJECTS),
          mutate(API_ENDPOINTS.AUDIT_LOGS)
        ]);
        return result.data;
      }
    } catch (err) {
      console.error('Failed to execute updateProjectProgress mutation:', err);
      throw err;
    }
  };

  return {
    members,
    grievances,
    projects,
    auditLogs,
    isLoading: membersLoading || grievancesLoading || projectsLoading || auditLogsLoading,
    isError: membersError || grievancesError || projectsError || auditLogsError,
    addMember,
    removeMember,
    updateGrievanceStatus,
    updateProjectProgress
  };
}
