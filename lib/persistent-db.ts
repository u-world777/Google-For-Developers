import fs from 'fs';
import path from 'path';
import { 
  INITIAL_GRIEVANCES, 
  INITIAL_PROJECTS, 
  Grievance, 
  ProjectData,
  GovernanceMember,
  INITIAL_MEMBERS,
  WardData,
  INITIAL_WARDS
} from './constituency-data';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorRole: 'MP' | 'COLLECTOR' | 'ENGINEER' | 'COUNCILLOR' | 'CITIZEN' | 'SYSTEM';
  actorName: string;
  actionType: 'FUND_SANCTION' | 'DIRECTIVE_ISSUED' | 'MACHINERY_DISPATCH' | 'STATUS_UPDATE' | 'CAMP_CREATED' | 'MEMBER_ADDED' | 'MEMBER_REMOVED';
  targetItem: string;
  details: string;
  impactMetric?: string;
}

export interface LokSevaDatabaseSchema {
  members: GovernanceMember[];
  grievances: Grievance[];
  projects: ProjectData[];
  auditLogs: AuditLogEntry[];
  wards: WardData[];
}

const dataDir = path.join(process.cwd(), 'data');
const dbFilePath = path.join(dataDir, 'lokseva-database.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial seed audit logs
const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    actorRole: 'MP',
    actorName: 'Dr. Rajeshwar Sharma (MP)',
    actionType: 'FUND_SANCTION',
    targetItem: 'Ward 5 School Approach Road & Lighting',
    details: 'Approved ₹1.65 Cr sanction from MPLADS Annual Fund. Fast-track order signed.',
    impactMetric: 'Benefits 350+ Students'
  },
  {
    id: 'audit-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    actorRole: 'COLLECTOR',
    actorName: 'Shri Vikramaditya Singh, IAS (DM)',
    actionType: 'DIRECTIVE_ISSUED',
    targetItem: 'PWD & Municipal Sanitation Division',
    details: 'Issued official Show-Cause Notice for desilting delay in Ward 3 Chowk Gali 4.',
    impactMetric: '24-Hour SLA Deadline'
  }
];

// Helper to load or initialize DB file on disk
function readDatabaseFromDisk(): LokSevaDatabaseSchema {
  try {
    if (fs.existsSync(dbFilePath)) {
      const raw = fs.readFileSync(dbFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        members: Array.isArray(parsed.members) ? parsed.members : [...INITIAL_MEMBERS],
        grievances: Array.isArray(parsed.grievances) ? parsed.grievances : [...INITIAL_GRIEVANCES],
        projects: Array.isArray(parsed.projects) ? parsed.projects : [...INITIAL_PROJECTS],
        auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : [...INITIAL_AUDIT_LOGS],
        wards: Array.isArray(parsed.wards) ? parsed.wards : [...INITIAL_WARDS]
      };
    }
  } catch (err) {
    console.warn('DB File read warning, initializing fresh dataset:', err);
  }

  // Initial seed if file doesn't exist
  const initialDb: LokSevaDatabaseSchema = {
    members: [...INITIAL_MEMBERS],
    grievances: [...INITIAL_GRIEVANCES],
    projects: [...INITIAL_PROJECTS],
    auditLogs: [...INITIAL_AUDIT_LOGS],
    wards: [...INITIAL_WARDS]
  };

  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(initialDb, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write initial DB file:', e);
  }

  return initialDb;
}

// Helper to write DB file synchronously
function saveDatabaseToDisk(data: LokSevaDatabaseSchema): void {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database to disk:', err);
  }
}

// In-Memory global singleton store backed by persistent file disk
const globalForDb = global as unknown as { persistentDb?: LokSevaDatabaseSchema };

if (!globalForDb.persistentDb) {
  globalForDb.persistentDb = readDatabaseFromDisk();
}

const memoryDb = globalForDb.persistentDb;

// Exported Database Service connected directly to persistent file storage
export const persistentDbService = {
  // Members CRUD
  getMembers: async (): Promise<GovernanceMember[]> => {
    return [...memoryDb.members];
  },

  addMember: async (member: GovernanceMember): Promise<GovernanceMember> => {
    memoryDb.members.unshift(member);
    saveDatabaseToDisk(memoryDb);

    await persistentDbService.addAuditLog({
      actorRole: 'MP',
      actorName: 'System Admin',
      actionType: 'MEMBER_ADDED',
      targetItem: member.name,
      details: `Added new governance team member ${member.name} (${member.title}) to ${member.department}.`
    });

    return member;
  },

  deleteMember: async (id: string): Promise<GovernanceMember | null> => {
    const idx = memoryDb.members.findIndex(m => m.id === id);
    if (idx !== -1) {
      const removed = memoryDb.members.splice(idx, 1)[0];
      saveDatabaseToDisk(memoryDb);

      await persistentDbService.addAuditLog({
        actorRole: 'MP',
        actorName: 'System Admin',
        actionType: 'MEMBER_REMOVED',
        targetItem: removed.name,
        details: `Removed team member ${removed.name} (${removed.title}) from active governance roster.`
      });

      return removed;
    }
    return null;
  },

  // Grievances CRUD
  getGrievances: async (query?: { category?: string; status?: string; priority?: string }): Promise<Grievance[]> => {
    let result = [...memoryDb.grievances];
    if (query?.category && query.category !== 'ALL') {
      result = result.filter(g => g.category === query.category);
    }
    if (query?.status && query.status !== 'ALL') {
      result = result.filter(g => g.status === query.status);
    }
    if (query?.priority && query.priority !== 'ALL') {
      result = result.filter(g => g.priority === query.priority);
    }
    return result;
  },

  addGrievance: async (grievance: Grievance): Promise<Grievance> => {
    memoryDb.grievances.unshift(grievance);
    saveDatabaseToDisk(memoryDb);
    return grievance;
  },

  updateGrievanceStatus: async (id: string, status: Grievance['status'], officer?: string, assignedLevel?: number): Promise<Grievance | null> => {
    const item = memoryDb.grievances.find(g => g.id === id || g.ticketId === id);
    if (item) {
      item.status = status;
      if (officer) item.officerInCharge = officer;
      if (assignedLevel) item.assignedLevel = assignedLevel as 1 | 2 | 3 | 4;
      saveDatabaseToDisk(memoryDb);
    }
    return item || null;
  },

  // Projects CRUD
  getProjects: async (): Promise<ProjectData[]> => {
    return [...memoryDb.projects];
  },

  updateProjectProgress: async (id: string, progressPercentage: number): Promise<ProjectData | null> => {
    const proj = memoryDb.projects.find(p => p.id === id);
    if (proj) {
      proj.progressPercentage = Math.min(100, Math.max(0, progressPercentage));
      if (proj.progressPercentage === 100) {
        proj.status = 'COMPLETED';
      } else if (proj.progressPercentage > 0) {
        proj.status = 'IN_PROGRESS';
      }
      saveDatabaseToDisk(memoryDb);
    }
    return proj || null;
  },

  addProject: async (project: ProjectData): Promise<ProjectData> => {
    memoryDb.projects.unshift(project);
    saveDatabaseToDisk(memoryDb);
    return project;
  },

  // Audit Logs CRUD
  getAuditLogs: async (): Promise<AuditLogEntry[]> => {
    return [...memoryDb.auditLogs];
  },

  addAuditLog: async (log: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> => {
    const newEntry: AuditLogEntry = {
      ...log,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    memoryDb.auditLogs.unshift(newEntry);
    saveDatabaseToDisk(memoryDb);
    return newEntry;
  },

  getWards: async (): Promise<WardData[]> => {
    return [...memoryDb.wards];
  }
};
