import { persistentDbService, AuditLogEntry } from './persistent-db';
import { GovernanceMember, INITIAL_MEMBERS } from './constituency-data';

export type { GovernanceMember, AuditLogEntry };
export { INITIAL_MEMBERS };

// Unified DB Service connected to persistent disk storage (data/lokseva-database.json)
export const dbService = persistentDbService;
