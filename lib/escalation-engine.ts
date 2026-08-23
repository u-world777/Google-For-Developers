import { Grievance, GovernanceMember } from './constituency-data';

export type EscalationLevel = 1 | 2 | 3 | 4;

export interface EscalationStep {
  level: EscalationLevel;
  role: 'COUNCILLOR' | 'ENGINEER' | 'COLLECTOR' | 'MP';
  label: string;
  shortLabel: string;
  description: string;
  officerName: string;
}

export const ESCALATION_LEVELS: Record<EscalationLevel, EscalationStep> = {
  1: {
    level: 1,
    role: 'COUNCILLOR',
    label: 'Level 1 - Ward Councillor',
    shortLabel: 'L1: Ward Councillor',
    description: 'First responder for local ward sanitation, streetlights, and drainage petitions.',
    officerName: 'Smt. Priya Gupta (Ward 3 Councillor)'
  },
  2: {
    level: 2,
    role: 'ENGINEER',
    label: 'Level 2 - Chief Engineer',
    shortLabel: 'L2: Chief Engineer',
    description: 'Technical infrastructure execution, heavy machinery dispatch, and roadworks.',
    officerName: 'Er. A. K. Verma (Chief Executive Engineer)'
  },
  3: {
    level: 3,
    role: 'COLLECTOR',
    label: 'Level 3 - District Collector',
    shortLabel: 'L3: District Collector',
    description: 'Enforcement level for SLA breached tickets and inter-departmental show cause.',
    officerName: 'Shri S. K. Roy, IAS (District Magistrate)'
  },
  4: {
    level: 4,
    role: 'MP',
    label: 'Level 4 - Member of Parliament',
    shortLabel: 'L4: MP Apex Level',
    description: 'Apex oversight level for high-priority policy and VIP constituency references.',
    officerName: 'Dr. R. Sharma (Member of Parliament)'
  }
};

export function getPendingAuthorityLabel(level?: number, role?: string): string {
  if (level === 4 || role === 'MP') return 'Level 4 - Member of Parliament';
  if (level === 3 || role === 'COLLECTOR') return 'Level 3 - District Collector';
  if (level === 2 || role === 'ENGINEER') return 'Level 2 - Chief Engineer';
  return 'Level 1 - Ward Councillor';
}

/**
 * 1. Smart Auto-Routing on Ticket Creation (Routes to Lowest Level: Level 1 Ward Councillor)
 */
export function autoRouteNewGrievance(
  wardName: string,
  category: string,
  members: GovernanceMember[]
): { assignedLevel: EscalationLevel; assignedRole: string; assignedOfficer: string } {
  const councillor = members.find(
    m => m.role === 'COUNCILLOR' && (m.wardName?.toLowerCase().includes(wardName.toLowerCase()) || wardName.toLowerCase().includes(m.wardName?.toLowerCase() || ''))
  ) || members.find(m => m.role === 'COUNCILLOR');

  return {
    assignedLevel: 1,
    assignedRole: 'COUNCILLOR',
    assignedOfficer: councillor ? `${councillor.name} (${councillor.title})` : 'Smt. Priya Gupta (Ward 3 Councillor)'
  };
}

/**
 * 2. Advance Escalation Ticket Up the Chain (L1 -> L2 -> L3 -> L4)
 */
export function escalateTicketToNextLevel(
  grievance: Grievance,
  reason?: string
): Partial<Grievance> {
  const currentLevel = (grievance.assignedLevel || 1) as EscalationLevel;
  const nextLevel = Math.min(4, currentLevel + 1) as EscalationLevel;
  const stepInfo = ESCALATION_LEVELS[nextLevel];

  const newStatus = nextLevel === 2 ? 'DISPATCHED' : nextLevel === 3 ? 'ESCALATED' : 'IN_EXECUTION';

  return {
    assignedLevel: nextLevel,
    assignedRole: stepInfo.role,
    assignedOfficer: stepInfo.officerName,
    officerInCharge: stepInfo.officerName,
    status: newStatus as Grievance['status'],
    timeline: [
      ...((grievance as any).timeline || []),
      {
        date: new Date().toISOString().split('T')[0],
        status: newStatus,
        note: reason
          ? `Escalated to ${stepInfo.label}: ${reason}`
          : `Ticket escalated up hierarchy to ${stepInfo.label} for binding action.`
      }
    ]
  };
}

/**
 * 3. SLA Auto-Escalation Engine (Advances Level if SLA breached)
 */
export function checkAndEscalateSLABreaches(grievances: Grievance[]): {
  updatedGrievances: Grievance[];
  breachedCount: number;
} {
  const now = new Date().getTime();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  let breachedCount = 0;

  const updatedGrievances = grievances.map(ticket => {
    if (ticket.status === 'RESOLVED' || ticket.assignedLevel === 4) {
      return ticket;
    }

    const createdTime = new Date(ticket.createdAt || Date.now()).getTime();
    const elapsedDays = (now - createdTime) / ONE_DAY_MS;
    const slaLimit = ticket.slaDays || 2;

    if (elapsedDays > slaLimit && ticket.assignedLevel! < 4) {
      breachedCount++;
      const nextLevel = Math.min(4, (ticket.assignedLevel || 1) + 1) as EscalationLevel;
      const stepInfo = ESCALATION_LEVELS[nextLevel];

      return {
        ...ticket,
        slaBreached: true,
        assignedLevel: nextLevel,
        assignedRole: stepInfo.role,
        assignedOfficer: stepInfo.officerName,
        officerInCharge: stepInfo.officerName,
        status: (nextLevel === 3 ? 'ESCALATED' : 'IN_EXECUTION') as Grievance['status'],
        timeline: [
          ...((ticket as any).timeline || []),
          {
            date: new Date().toISOString().split('T')[0],
            status: 'ESCALATED',
            note: `🚨 SLA BREACH: Automatically escalated to ${stepInfo.label} due to response deadline expiration.`
          }
        ]
      };
    }

    return ticket;
  });

  return { updatedGrievances, breachedCount };
}

/**
 * 4. Filter Tickets based on User Role and Ward
 */
export function filterGrievancesByRole(
  grievances: Grievance[],
  userRole: string,
  userWard?: string
): Grievance[] {
  if (userRole === 'MP' || userRole === 'ADMIN') {
    return grievances;
  }

  if (userRole === 'COLLECTOR') {
    return grievances.filter(g => g.slaBreached || g.assignedLevel === 3 || g.status === 'ESCALATED' || g.priority === 'CRITICAL');
  }

  if (userRole === 'ENGINEER') {
    return grievances.filter(g => g.assignedLevel === 2 || g.assignedRole === 'ENGINEER' || g.category === 'Roads & Public Works' || g.category === 'Water & Sanitation');
  }

  if (userRole === 'COUNCILLOR') {
    return grievances.filter(g => {
      if (g.assignedLevel === 1 || g.assignedRole === 'COUNCILLOR') return true;
      if (userWard && g.wardName?.toLowerCase().includes(userWard.toLowerCase())) return true;
      return true;
    });
  }

  return grievances;
}

/**
 * Function stub for escalating a ticket up the chain (Level 1 -> Level 2 -> Level 3 -> Level 4)
 */
export function escalateTicket(ticketId: string): void {
  console.log(`[Escalation Engine] Escalating ticket #${ticketId} up hierarchy chain (Level 1 -> 2 -> 3 -> 4).`);
}

