'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mutate } from 'swr';
import { INITIAL_GRIEVANCES, INITIAL_PROJECTS, Grievance, ProjectData, GovernanceMember, INITIAL_MEMBERS } from './constituency-data';
import { escalateTicketToNextLevel } from './escalation-engine';

export type GovernanceRole = 'MP' | 'COLLECTOR' | 'ENGINEER' | 'COUNCILLOR';

export interface RoleDetails {
  key: GovernanceRole;
  name: string;
  title: string;
  badge: string;
  department: string;
  primaryFocus: string;
  avatarBg: string;
  accentColor: string;
}

export const GOVERNANCE_ROLES: Record<GovernanceRole, RoleDetails> = {
  MP: {
    key: 'MP',
    name: 'Dr. R. Sharma',
    title: 'Member of Parliament (MP)',
    badge: 'MP',
    department: 'Lok Sabha Constituency Office',
    primaryFocus: 'Constituency Development & MPLADS Fund Sanctions',
    avatarBg: 'from-amber-500 to-amber-700',
    accentColor: 'text-amber-400'
  },
  COLLECTOR: {
    key: 'COLLECTOR',
    name: 'Shri S. K. Roy, IAS',
    title: 'District Collector & Magistrate (DM)',
    badge: 'IAS',
    department: 'District Administration & SLA Enforcement',
    primaryFocus: 'Multi-Departmental Coordination & Emergency Directives',
    avatarBg: 'from-sky-500 to-blue-700',
    accentColor: 'text-sky-400'
  },
  ENGINEER: {
    key: 'ENGINEER',
    name: 'Er. A. K. Verma',
    title: 'Chief Executive Engineer',
    badge: 'PWD',
    department: 'Public Works & Infrastructure Execution Cell',
    primaryFocus: 'Tenders, Contractor Oversight & Technical Work-Orders',
    avatarBg: 'from-emerald-500 to-teal-700',
    accentColor: 'text-emerald-400'
  },
  COUNCILLOR: {
    key: 'COUNCILLOR',
    name: 'Smt. Priya Gupta',
    title: 'Ward 3 Municipal Councillor',
    badge: 'WARD',
    department: 'Ward 3 Public Welfare & Resident Advisory',
    primaryFocus: 'Grassroots Resident Petitions & Scheme Camps',
    avatarBg: 'from-purple-500 to-indigo-700',
    accentColor: 'text-indigo-400'
  }
};

export interface GovernanceLog {
  id: string;
  timestamp: string;
  role: GovernanceRole;
  roleName: string;
  actionTitle: string;
  description: string;
  ticketId?: string;
  wardName?: string;
}

interface GovernanceContextType {
  activeRole: GovernanceRole;
  setRole: (role: GovernanceRole) => void;
  roleDetails: RoleDetails;
  activeMemberId: string;
  setActiveMemberId: (id: string) => void;
  currentMember: GovernanceMember;
  grievances: Grievance[];
  projects: ProjectData[];
  auditLogs: GovernanceLog[];
  members: GovernanceMember[];
  addGrievance: (grievance: Grievance) => void;
  executeRoleActionOnTicket: (ticketId: string, actionType: 'MP_SANCTION' | 'DM_SHOW_CAUSE' | 'ENGINEER_DISPATCH' | 'COUNCILLOR_VERIFY' | 'RESOLVE', notes?: string) => void;
  escalateGrievanceTicket: (ticketId: string, reason?: string) => void;
  approveProjectFund: (projectId: string, amountCr: number) => void;
  updateProjectProgress: (projectId: string, progress: number, status: ProjectData['status']) => void;
  resetDataToDefault: () => void;
  addMember: (memberData: Omit<GovernanceMember, 'id' | 'status' | 'joinedDate'>) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
}

const GovernanceContext = createContext<GovernanceContextType>({
  activeRole: 'MP',
  setRole: () => {},
  roleDetails: GOVERNANCE_ROLES.MP,
  activeMemberId: 'mem-1',
  setActiveMemberId: () => {},
  currentMember: INITIAL_MEMBERS[0],
  grievances: [],
  projects: [],
  auditLogs: [],
  members: [],
  addGrievance: () => {},
  executeRoleActionOnTicket: () => {},
  escalateGrievanceTicket: () => {},
  approveProjectFund: () => {},
  updateProjectProgress: () => {},
  resetDataToDefault: () => {},
  addMember: async () => {},
  removeMember: async () => {}
});

export function GovernanceProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRoleState] = useState<GovernanceRole>('MP');
  const [activeMemberId, setActiveMemberIdState] = useState<string>('mem-1');
  const [grievances, setGrievances] = useState<Grievance[]>(INITIAL_GRIEVANCES);
  const [projects, setProjects] = useState<ProjectData[]>(INITIAL_PROJECTS);
  const [members, setMembers] = useState<GovernanceMember[]>(INITIAL_MEMBERS);
  const [auditLogs, setAuditLogs] = useState<GovernanceLog[]>([
    {
      id: 'log-1',
      timestamp: new Date().toISOString(),
      role: 'MP',
      roleName: 'Dr. R. Sharma (MP)',
      actionTitle: 'DPI Governance Control Center Initialized',
      description: 'System synchronized active telemetry across MP, DM, PWD Engineer, and Councillor portals.',
      wardName: 'Varanasi South'
    }
  ]);

  // Initial sync with Next.js Backend API routes (/api/grievances, /api/projects, /api/audit-logs)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('lokseva_governance_role') as GovernanceRole;
      if (savedRole && GOVERNANCE_ROLES[savedRole]) {
        setActiveRoleState(savedRole);
      }
    }

    // Fetch initial records from Backend API
    const syncWithBackendApi = async () => {
      try {
        const [gRes, pRes, aRes, mRes] = await Promise.all([
          fetch('/api/grievances').then(r => r.json()).catch(() => null),
          fetch('/api/projects').then(r => r.json()).catch(() => null),
          fetch('/api/audit-logs').then(r => r.json()).catch(() => null),
          fetch('/api/members').then(r => r.json()).catch(() => null)
        ]);

        if (mRes?.success && Array.isArray(mRes.data)) {
          setMembers(mRes.data);
        }

        if (gRes?.success && Array.isArray(gRes.data)) {
          setGrievances(gRes.data);
          if (typeof window !== 'undefined') localStorage.setItem('lokseva_grievances', JSON.stringify(gRes.data));
        } else if (typeof window !== 'undefined') {
          const savedGrievances = localStorage.getItem('lokseva_grievances');
          if (savedGrievances) {
            try { setGrievances(JSON.parse(savedGrievances)); } catch (e) {}
          }
        }

        if (pRes?.success && Array.isArray(pRes.data)) {
          setProjects(pRes.data);
          if (typeof window !== 'undefined') localStorage.setItem('lokseva_projects', JSON.stringify(pRes.data));
        } else if (typeof window !== 'undefined') {
          const savedProjects = localStorage.getItem('lokseva_projects');
          if (savedProjects) {
            try { setProjects(JSON.parse(savedProjects)); } catch (e) {}
          }
        }

        if (aRes?.success && Array.isArray(aRes.data)) {
          // Transform db audit logs into GovernanceLog format
          const formattedLogs: GovernanceLog[] = aRes.data.map((log: any) => ({
            id: log.id || `log-${Date.now()}`,
            timestamp: log.timestamp || new Date().toISOString(),
            role: log.actorRole || 'MP',
            roleName: log.actorName || 'Executive Authority',
            actionTitle: `${log.actionType}: ${log.targetItem}`,
            description: log.details,
            wardName: log.targetItem
          }));
          setAuditLogs(formattedLogs);
        }
      } catch (err) {
        console.warn('Backend API Sync Fallback to Local Storage:', err);
      }
    };

    syncWithBackendApi();
  }, []);

  const saveGrievancesState = (list: Grievance[]) => {
    setGrievances(list);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lokseva_grievances', JSON.stringify(list));
    }
  };

  const saveProjectsState = (list: ProjectData[]) => {
    setProjects(list);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lokseva_projects', JSON.stringify(list));
    }
  };

  const addAuditLog = (log: Omit<GovernanceLog, 'id' | 'timestamp'>) => {
    const newLog: GovernanceLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lokseva_audit_logs', JSON.stringify(updated));
    }

    // Sync Audit Log with Server API
    fetch('/api/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actorRole: log.role,
        actorName: log.roleName,
        actionType: 'DIRECTIVE_ISSUED',
        targetItem: log.wardName || log.actionTitle,
        details: log.description,
        impactMetric: log.ticketId ? `Ticket #${log.ticketId}` : undefined
      })
    }).catch(err => console.warn('API Audit Log Sync Note:', err));
  };

  const setRole = (role: GovernanceRole) => {
    setActiveRoleState(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lokseva_governance_role', role);
    }
  };

  const addGrievance = (newTicket: Grievance) => {
    const routedTicket: Grievance = {
      ...newTicket,
      assignedLevel: newTicket.assignedLevel || 1,
      assignedRole: newTicket.assignedRole || 'COUNCILLOR',
      assignedOfficer: newTicket.assignedOfficer || 'Smt. Priya Gupta (Ward 3 Councillor)'
    };
    const updated = [routedTicket, ...grievances];
    saveGrievancesState(updated);
    addAuditLog({
      role: activeRole,
      roleName: GOVERNANCE_ROLES[activeRole].name,
      actionTitle: `New Grievance Auto-Routed to Level 1 Councillor (#${routedTicket.ticketId})`,
      description: `Complaint regarding ${routedTicket.category} in ${routedTicket.wardName} auto-routed to ${routedTicket.assignedOfficer}. Assigned SLA: ${routedTicket.slaDays} days.`,
      ticketId: routedTicket.ticketId,
      wardName: routedTicket.wardName
    });

    // Sync Grievance with Server API (/api/grievances)
    fetch('/api/grievances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawInput: routedTicket.rawInput,
        citizenName: routedTicket.citizenName,
        phone: routedTicket.phone,
        source: routedTicket.source,
        wardName: routedTicket.wardName
      })
    }).catch(err => console.warn('API Grievance Sync Note:', err));
  };

  const executeRoleActionOnTicket = (
    ticketId: string,
    actionType: 'MP_SANCTION' | 'DM_SHOW_CAUSE' | 'ENGINEER_DISPATCH' | 'COUNCILLOR_VERIFY' | 'RESOLVE',
    notes?: string
  ) => {
    const currentRole = GOVERNANCE_ROLES[activeRole];

    const updatedGrievances = grievances.map(ticket => {
      if (ticket.id !== ticketId && ticket.ticketId !== ticketId) return ticket;

      let newStatus = ticket.status;
      let newOfficer = ticket.officerInCharge;
      let logTitle = '';
      let logDesc = '';

      if (actionType === 'MP_SANCTION') {
        newStatus = 'DISPATCHED';
        logTitle = `MP Executive Fund Sanction (#${ticket.ticketId})`;
        logDesc = `MP Dr. R. Sharma approved direct emergency fund release for ${ticket.category} in ${ticket.wardName}. Priority set to CRITICAL.`;

        // Auto-create infrastructure project in Project Tracker if high-priority
        const newProj: ProjectData = {
          id: `proj-${Date.now()}`,
          name: `Emergency Work: ${ticket.category} (${ticket.wardName})`,
          wardId: ticket.wardId,
          wardName: ticket.wardName,
          category: ticket.category === 'Water & Sanitation' ? 'SANITATION' : 'ROADS',
          sanctionedBudgetCr: 0.85,
          spentBudgetCr: 0.25,
          progressPercentage: 15,
          contractorName: 'Apex Infrastructure Pvt Ltd',
          startDate: new Date().toISOString().split('T')[0],
          targetCompletionDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
          status: 'IN_PROGRESS',
          description: `Emergency repair sanctioned by MP based on constituent ticket #${ticket.ticketId}.`
        };
        saveProjectsState([newProj, ...projects]);
      } else if (actionType === 'DM_SHOW_CAUSE') {
        newStatus = 'ESCALATED';
        logTitle = `DM 24h Show-Cause Order Issued (#${ticket.ticketId})`;
        logDesc = `District Magistrate Shri S. K. Roy, IAS issued binding show-cause notice to ${ticket.assignedDepartment} with 24-hr SLA resolution order.`;
      } else if (actionType === 'ENGINEER_DISPATCH') {
        newStatus = 'IN_EXECUTION';
        newOfficer = 'Er. A. K. Verma (Chief Executive Engineer)';
        logTitle = `PWD Field Machinery & Fleet Dispatched (#${ticket.ticketId})`;
        logDesc = `Chief Engineer Er. A. K. Verma approved contractor work-order & dispatched repair jetting/equipment fleet to ${ticket.locationDetails}.`;
      } else if (actionType === 'COUNCILLOR_VERIFY') {
        newStatus = 'COUNCILLOR_VERIFIED';
        logTitle = `Ward Councillor Doorstep Verification (#${ticket.ticketId})`;
        logDesc = `Ward 3 Councillor Smt. Priya Gupta verified ground situation in ${ticket.wardName} and attached resident petition notes.`;
      } else if (actionType === 'RESOLVE') {
        newStatus = 'RESOLVED';
        logTitle = `Grievance Fully Resolved & Closed (#${ticket.ticketId})`;
        logDesc = `Work completed by ${ticket.assignedDepartment}. Automated confirmation message sent to constituent ${ticket.citizenName}.`;
      }

      addAuditLog({
        role: activeRole,
        roleName: currentRole.name,
        actionTitle: logTitle,
        description: notes ? `${logDesc} Notes: ${notes}` : logDesc,
        ticketId: ticket.ticketId,
        wardName: ticket.wardName
      });

      // Sync Ticket Update with Server API (/api/grievances)
      fetch('/api/grievances', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ticket.id,
          status: newStatus,
          officerInCharge: newOfficer,
          actorRole: activeRole,
          actorName: currentRole.name,
          directiveNote: notes
        })
      }).catch(err => console.warn('API Grievance Patch Sync Note:', err));

      return {
        ...ticket,
        status: newStatus,
        officerInCharge: newOfficer
      };
    });

    saveGrievancesState(updatedGrievances);
  };

  const escalateGrievanceTicket = (ticketId: string, reason?: string) => {
    const updatedGrievances = grievances.map(ticket => {
      if (ticket.id !== ticketId && ticket.ticketId !== ticketId) return ticket;
      const partial = escalateTicketToNextLevel(ticket, reason);
      const updatedTicket = { ...ticket, ...partial };

      addAuditLog({
        role: activeRole,
        roleName: GOVERNANCE_ROLES[activeRole]?.name || 'Governance Authority',
        actionTitle: `Ticket Escalated to Level ${updatedTicket.assignedLevel} (#${ticket.ticketId})`,
        description: reason || `Escalated ticket to Level ${updatedTicket.assignedLevel} (${updatedTicket.assignedOfficer}).`,
        ticketId: ticket.ticketId,
        wardName: ticket.wardName
      });

      fetch('/api/grievances', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ticket.id,
          status: updatedTicket.status,
          officerInCharge: updatedTicket.assignedOfficer,
          assignedLevel: updatedTicket.assignedLevel,
          actorRole: activeRole,
          directiveNote: reason
        })
      }).catch(err => console.warn('API Grievance Patch Sync Note:', err));

      return updatedTicket;
    });

    saveGrievancesState(updatedGrievances);
  };

  const approveProjectFund = (projectId: string, amountCr: number) => {
    const targetProject = projects.find(p => p.id === projectId);
    const updated = projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        sanctionedBudgetCr: p.sanctionedBudgetCr + amountCr,
        status: 'IN_PROGRESS' as const
      };
    });
    saveProjectsState(updated);
    addAuditLog({
      role: activeRole,
      roleName: GOVERNANCE_ROLES[activeRole].name,
      actionTitle: `Project Budget Sanction Approved`,
      description: `Sanctioned additional ₹${amountCr} Cr for project '${targetProject?.name}'.`
    });

    // Sync with Server API (/api/projects)
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: targetProject?.name || 'MPLADS Infrastructure Fund Release',
        wardName: targetProject?.wardName,
        sanctionedBudgetCr: amountCr,
        actorName: GOVERNANCE_ROLES[activeRole].name
      })
    }).catch(err => console.warn('API Project Post Sync Note:', err));
  };

  const updateProjectProgress = (projectId: string, progress: number, status: ProjectData['status']) => {
    const targetProject = projects.find(p => p.id === projectId);
    const updated = projects.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, progressPercentage: progress, status };
    });
    saveProjectsState(updated);
    addAuditLog({
      role: activeRole,
      roleName: GOVERNANCE_ROLES[activeRole].name,
      actionTitle: `Project Progress Updated (${progress}%)`,
      description: `Execution status updated to ${status} for project '${targetProject?.name}'.`
    });

    // Sync with Server API (/api/projects)
    fetch('/api/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: projectId,
        progressPercentage: progress,
        actorRole: activeRole,
        actorName: GOVERNANCE_ROLES[activeRole].name
      })
    }).catch(err => console.warn('API Project Patch Sync Note:', err));
  };

  const addMember = async (memberData: Omit<GovernanceMember, 'id' | 'status' | 'joinedDate'>) => {
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMembers(prev => [data.data, ...prev]);
        // Trigger SWR real-time global cache mutation across all active panels & components
        await Promise.all([
          mutate('/api/members'),
          mutate('/api/audit-logs')
        ]);

        addAuditLog({
          role: activeRole,
          roleName: GOVERNANCE_ROLES[activeRole].name,
          actionTitle: `New Member Added (${data.data.name})`,
          description: `Assigned ${data.data.name} as ${data.data.title} in ${data.data.department}.`
        });
      }
    } catch (err) {
      console.error('Failed to add member:', err);
    }
  };

  const removeMember = async (id: string) => {
    try {
      const target = members.find(m => m.id === id);
      const res = await fetch(`/api/members?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMembers(prev => prev.filter(m => m.id !== id));
        // Trigger SWR real-time global cache mutation across all active panels & components
        await Promise.all([
          mutate('/api/members'),
          mutate('/api/audit-logs')
        ]);

        addAuditLog({
          role: activeRole,
          roleName: GOVERNANCE_ROLES[activeRole].name,
          actionTitle: `Member Removed (${target?.name || id})`,
          description: `Deactivated governance member ${target?.name || id} from active roster.`
        });
      }
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  const resetDataToDefault = () => {
    setGrievances(INITIAL_GRIEVANCES);
    setProjects(INITIAL_PROJECTS);
    setMembers(INITIAL_MEMBERS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lokseva_grievances');
      localStorage.removeItem('lokseva_projects');
      localStorage.removeItem('lokseva_audit_logs');
    }
    addAuditLog({
      role: 'MP',
      roleName: 'System Superuser Admin',
      actionTitle: 'System Reset to Default Data',
      description: 'Superuser performed full state reset across all ward grievances and MPLADS project records.'
    });
  };

  const currentMember: GovernanceMember = members.find(m => m.id === activeMemberId) || 
    members.find(m => m.role === activeRole) || 
    members[0] || 
    INITIAL_MEMBERS[0];

  const computedRoleDetails: RoleDetails = {
    key: (currentMember?.role as GovernanceRole) || activeRole || 'MP',
    name: currentMember?.name || 'Dr. R. Sharma',
    title: currentMember?.title || 'Member of Parliament (MP)',
    badge: currentMember?.role || 'MP',
    department: currentMember?.department || 'Lok Sabha Constituency Office',
    primaryFocus: 'Constituency Governance & Public Welfare Execution',
    avatarBg: currentMember?.role === 'MP' ? 'from-amber-500 to-amber-700' :
              currentMember?.role === 'COLLECTOR' ? 'from-sky-500 to-blue-700' :
              currentMember?.role === 'ENGINEER' ? 'from-emerald-500 to-teal-700' :
              'from-purple-500 to-indigo-700',
    accentColor: currentMember?.role === 'MP' ? 'text-amber-400' :
                 currentMember?.role === 'COLLECTOR' ? 'text-sky-400' :
                 currentMember?.role === 'ENGINEER' ? 'text-emerald-400' :
                 'text-indigo-400'
  };

  const setActiveMemberId = (id: string) => {
    setActiveMemberIdState(id);
    const target = members.find(m => m.id === id);
    if (target) {
      setActiveRoleState(target.role as GovernanceRole);
      if (typeof window !== 'undefined') {
        localStorage.setItem('lokseva_governance_role', target.role);
        localStorage.setItem('lokseva_governance_member_id', id);
      }
    }
  };

  return (
    <GovernanceContext.Provider
      value={{
        activeRole,
        setRole,
        roleDetails: computedRoleDetails,
        activeMemberId,
        setActiveMemberId,
        currentMember,
        grievances,
        projects,
        auditLogs,
        members,
        addGrievance,
        executeRoleActionOnTicket,
        escalateGrievanceTicket,
        approveProjectFund,
        updateProjectProgress,
        resetDataToDefault,
        addMember,
        removeMember
      }}
    >
      {children}
    </GovernanceContext.Provider>
  );
}

export function useGovernance() {
  return useContext(GovernanceContext);
}
