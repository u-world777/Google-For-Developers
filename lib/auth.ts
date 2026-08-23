import { UserRoleCategory } from './rbac/permissions';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRoleCategory | 'CITIZEN';
  title: string;
  department: string;
  token: string;
}

export const MOCK_USERS: Record<string, UserSession> = {
  'citizen@lokseva.gov.in': {
    id: 'usr-citizen',
    name: 'Rameshwar Prasad',
    email: 'citizen@lokseva.gov.in',
    role: 'CITIZEN',
    title: 'Ward 3 Resident & Weaver',
    department: 'LokSeva Public Citizen Portal',
    token: 'tok-citizen-123'
  },
  'councillor@lokseva.gov.in': {
    id: 'usr-councillor',
    name: 'Smt. Priya Gupta',
    email: 'councillor@lokseva.gov.in',
    role: 'COUNCILLOR',
    title: 'Ward 3 Municipal Councillor',
    department: 'Ward 3 Public Welfare Cell',
    token: 'tok-councillor-456'
  },
  'engineer@lokseva.gov.in': {
    id: 'usr-engineer',
    name: 'Er. A. K. Verma',
    email: 'engineer@lokseva.gov.in',
    role: 'ENGINEER',
    title: 'Chief Executive Engineer',
    department: 'Public Works & Infrastructure Execution Cell',
    token: 'tok-engineer-789'
  },
  'collector@lokseva.gov.in': {
    id: 'usr-collector',
    name: 'Shri S. K. Roy, IAS',
    email: 'collector@lokseva.gov.in',
    role: 'COLLECTOR',
    title: 'District Collector & Magistrate (DM)',
    department: 'District Administration & SLA Enforcement',
    token: 'tok-collector-101'
  },
  'mp@lokseva.gov.in': {
    id: 'usr-mp',
    name: 'Dr. R. Sharma',
    email: 'mp@lokseva.gov.in',
    role: 'MP',
    title: 'Member of Parliament (MP)',
    department: 'Lok Sabha Constituency Apex Office',
    token: 'tok-mp-999'
  }
};

export const ROLE_DASHBOARD_ROUTES: Record<string, string> = {
  CITIZEN: '/dashboard/citizen',
  COUNCILLOR: '/dashboard/councillor',
  ENGINEER: '/dashboard/engineer',
  COLLECTOR: '/dashboard/collector',
  MP: '/dashboard/mp'
};

export function getSession(): UserSession {
  if (typeof window === 'undefined') return MOCK_USERS['mp@lokseva.gov.in'];
  const stored = localStorage.getItem('lokseva_user_session');
  if (!stored) {
    const defaultSession = MOCK_USERS['mp@lokseva.gov.in'];
    localStorage.setItem('lokseva_user_session', JSON.stringify(defaultSession));
    document.cookie = `lokseva_role=${defaultSession.role}; path=/; max-age=86400`;
    return defaultSession;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return MOCK_USERS['mp@lokseva.gov.in'];
  }
}

export function setSession(session: UserSession): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lokseva_user_session', JSON.stringify(session));
    localStorage.setItem('lokseva_governance_role', session.role === 'CITIZEN' ? 'COUNCILLOR' : session.role);
    document.cookie = `lokseva_role=${session.role}; path=/; max-age=86400`;
  }
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('lokseva_user_session');
    document.cookie = 'lokseva_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}
