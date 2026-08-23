# LokSeva AI — Intelligent Governance & Citizen Engagement Platform

LokSeva AI is a comprehensive, multi-stakeholder governance platform designed to streamline grievance resolution, project tracking, SLA-based escalation, and constituency management across all administrative tiers.

---

## 🌟 Key Features

### 🔐 Role-Based Access Control (RBAC) & Multi-Role Dashboards
Dedicated workflows and tailored dashboards for each governance tier:
- **Citizen (`/dashboard/citizen`)**: Submit grievances, track real-time resolution status, view local infrastructure projects, and search government schemes using AI.
- **Councillor (`/dashboard/councillor`)**: Monitor ward-level issues, assign priorities, and route grievances to executive engineers.
- **Engineer (`/dashboard/engineer`)**: Manage technical work orders, update field status, and log resolution progress.
- **District Collector (`/dashboard/collector`)**: District-level analytics, SLA compliance monitoring, departmental performance auditing, and escalation oversight.
- **Member of Parliament (`/dashboard/mp`)**: High-level constituency overview, MPLADS fund utilization, milestone tracking, and macro-level audit logs.

### ⚡ Automated Escalation Engine
- Time-based SLA tracking for all citizen grievances.
- Multi-tier automatic escalation matrix (Ward Councillor ➔ Executive Engineer ➔ District Collector).
- Real-time audit logs documenting every status change and administrative intervention.

### 🤖 Gemini AI & Multilingual RAG Engine
- AI-assisted scheme recommendation and citizen query resolution.
- Multilingual capability supporting English and Hindi (`en`/`hi`).

### 📱 WhatsApp Webhook Integration
- Webhook route (`/api/whatsapp-webhook`) enabling citizens to register and track grievances directly via WhatsApp.

### 💾 Persistent Data Layer
- Powered by SQLite (`data/lokseva.sqlite` via `better-sqlite3`) with seamless JSON fallback (`data/lokseva-database.json`).

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide Icons, Framer Motion
- **Database**: SQLite (`better-sqlite3`) / JSON Data Layer
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Authentication & RBAC**: Custom Session Context, AuthGuard, & Granular Permission Middleware

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and `npm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/u-world777/Google-For-Developers.git
   cd Google-For-Developers
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   WHATSAPP_VERIFY_TOKEN=lokseva_whatsapp_secret
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Repository Structure

```
├── app/
│   ├── admin/                # Platform administration
│   ├── api/                  # REST API routes (auth, grievances, projects, audit-logs, whatsapp)
│   ├── dashboard/            # Role-specific dashboards (citizen, councillor, engineer, collector, mp)
│   ├── grievances/           # Grievance management views
│   ├── projects/             # Development project tracking
│   ├── login/                # Authentication page
│   └── layout.tsx            # Global layout & governance provider wrapper
├── components/
│   ├── rbac/                 # AuthGuard, RequireRole, RequirePermission wrappers
│   ├── layouts/              # Custom layout components for MP & Engineer views
│   ├── GovernanceAuditFeed.tsx
│   ├── GovernanceRoleBanner.tsx
│   └── GrievanceCard.tsx
├── data/
│   ├── lokseva.sqlite        # SQLite Database
│   └── lokseva-database.json # Default seed database
├── lib/
│   ├── auth.ts               # Demo authentication & session management
│   ├── escalation-engine.ts  # Automated SLA escalation logic
│   ├── sqlite-db.ts          # SQLite database interface & DAO queries
│   ├── governance-context.tsx# React context for governance state
│   └── rbac/permissions.ts   # Role definitions & permission maps
├── middleware.ts             # Route protection middleware
└── README.md
```

---

## 📝 Demo Login Credentials

For testing individual role dashboards in local environment:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@lokseva.gov.in` | `password` | Submit & View Grievances, Schemes |
| **Councillor** | `councillor@lokseva.gov.in` | `password` | Ward Management & Escalations |
| **Engineer** | `engineer@lokseva.gov.in` | `password` | Technical Work Orders |
| **Collector** | `collector@lokseva.gov.in` | `password` | District SLAs & Auditing |
| **MP** | `mp@lokseva.gov.in` | `password` | Constituency Oversight & MPLADS |

---

## 📄 License

This project is licensed under the MIT License.
