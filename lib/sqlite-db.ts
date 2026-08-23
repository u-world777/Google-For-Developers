import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { 
  INITIAL_GRIEVANCES, 
  INITIAL_PROJECTS, 
  Grievance, 
  ProjectData,
  GovernanceMember,
  INITIAL_MEMBERS 
} from './constituency-data';

export type { GovernanceMember };

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

// Persistent SQLite Database File Location
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'lokseva.sqlite');

// Initialize SQLite Connection Singleton
const globalForSqlite = global as unknown as { sqliteInstance?: any };

function getSqliteDatabase(): any {
  if (!globalForSqlite.sqliteInstance) {
    const sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL');

    // Create Tables if not existing
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS members (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        role TEXT NOT NULL,
        department TEXT NOT NULL,
        wardName TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        status TEXT NOT NULL,
        joinedDate TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS grievances (
        id TEXT PRIMARY KEY,
        ticketId TEXT UNIQUE NOT NULL,
        citizenName TEXT NOT NULL,
        citizenPhone TEXT NOT NULL,
        wardName TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        priority TEXT NOT NULL,
        status TEXT NOT NULL,
        slaDays INTEGER NOT NULL,
        assignedDepartment TEXT NOT NULL,
        officerInCharge TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        wardName TEXT NOT NULL,
        category TEXT NOT NULL,
        sanctionedBudgetCr REAL NOT NULL,
        spentBudgetCr REAL NOT NULL,
        progressPercentage INTEGER NOT NULL,
        contractor TEXT NOT NULL,
        status TEXT NOT NULL,
        startDate TEXT NOT NULL,
        targetCompletionDate TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        actorRole TEXT NOT NULL,
        actorName TEXT NOT NULL,
        actionType TEXT NOT NULL,
        targetItem TEXT NOT NULL,
        details TEXT NOT NULL,
        impactMetric TEXT
      );
    `);

    // Seed data if tables are empty
    const memberCount = sqlite.prepare('SELECT COUNT(*) as count FROM members').get() as { count: number };
    if (memberCount.count === 0) {
      const insertMem = sqlite.prepare(`
        INSERT INTO members (id, name, title, role, department, wardName, email, phone, status, joinedDate)
        VALUES (@id, @name, @title, @role, @department, @wardName, @email, @phone, @status, @joinedDate)
      `);
      for (const m of INITIAL_MEMBERS) {
        insertMem.run(m);
      }
    }

    const grievanceCount = sqlite.prepare('SELECT COUNT(*) as count FROM grievances').get() as { count: number };
    if (grievanceCount.count === 0) {
      const insertGrievance = sqlite.prepare(`
        INSERT INTO grievances (id, ticketId, citizenName, citizenPhone, wardName, category, description, priority, status, slaDays, assignedDepartment, officerInCharge, createdAt)
        VALUES (@id, @ticketId, @citizenName, @citizenPhone, @wardName, @category, @description, @priority, @status, @slaDays, @assignedDepartment, @officerInCharge, @createdAt)
      `);
      for (const g of INITIAL_GRIEVANCES) {
        insertGrievance.run(g);
      }
    }

    const projectCount = sqlite.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
    if (projectCount.count === 0) {
      const insertProject = sqlite.prepare(`
        INSERT INTO projects (id, code, name, wardName, category, sanctionedBudgetCr, spentBudgetCr, progressPercentage, contractor, status, startDate, targetCompletionDate)
        VALUES (@id, @code, @name, @wardName, @category, @sanctionedBudgetCr, @spentBudgetCr, @progressPercentage, @contractor, @status, @startDate, @targetCompletionDate)
      `);
      for (const p of INITIAL_PROJECTS) {
        insertProject.run(p);
      }
    }

    const auditCount = sqlite.prepare('SELECT COUNT(*) as count FROM audit_logs').get() as { count: number };
    if (auditCount.count === 0) {
      sqlite.prepare(`
        INSERT INTO audit_logs (id, timestamp, actorRole, actorName, actionType, targetItem, details, impactMetric)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'audit-1',
        new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        'MP',
        'Dr. Rajeshwar Sharma (MP)',
        'FUND_SANCTION',
        'Ward 5 School Approach Road & Lighting',
        'Approved ₹1.65 Cr sanction from MPLADS Annual Fund. Fast-track order signed.',
        'Benefits 350+ Students'
      );
    }

    globalForSqlite.sqliteInstance = sqlite;
  }

  return globalForSqlite.sqliteInstance;
}

export const sqliteDb = getSqliteDatabase();
