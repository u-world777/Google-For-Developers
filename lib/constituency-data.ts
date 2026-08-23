export interface WardData {
  id: string;
  name: string;
  code: string;
  population: number;
  bplPercentage: number;
  literacyRate: number;
  infrastructureScore: number; // 0 to 100
  waterAccessScore: number; // 0 to 100
  sanitationIndex: number; // 0 to 100
  roadQualityScore: number; // 0 to 100
  healthcareDensity: number; // Clinics per 10k people
  activeGrievanceCount: number;
  budgetAllocatedCr: number; // In Crores INR
  recommendedBudgetCr: number;
  urgentNeeds: string[];
}

export interface Grievance {
  id: string;
  ticketId: string;
  createdAt: string;
  citizenName: string;
  phone?: string;
  source: 'VOICE_NOTE' | 'SCANNED_LETTER' | 'WHATSAPP' | 'PORTAL' | 'SOCIAL_MEDIA';
  rawInput: string;
  audioUrl?: string;
  documentSnippet?: string;
  category: 'Water & Sanitation' | 'Roads & Public Works' | 'Healthcare' | 'Electricity & Energy' | 'Education' | 'Social Welfare & Pensions' | 'Housing' | 'Public Safety';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING_AI' | 'AI_PROCESSED' | 'DISPATCHED' | 'IN_PROGRESS' | 'RESOLVED' | 'COUNCILLOR_VERIFIED' | 'IN_EXECUTION' | 'ESCALATED';
  assignedLevel?: 1 | 2 | 3 | 4;
  assignedRole?: string;
  assignedOfficer?: string;
  slaBreached?: boolean;
  timeline?: Array<{ date: string; status: string; note: string }>;
  wardId: string;
  wardName: string;
  locationDetails: string;
  sentiment: 'VERY_NEGATIVE' | 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE';
  sentimentScore: number; // -1.0 to +1.0
  aiSummary: string;
  aiKeyEntities: {
    location?: string;
    affectedCount?: string;
    urgencyReason?: string;
    department?: string;
  };
  assignedDepartment: string;
  officerInCharge: string;
  slaDays: number;
  aiSuggestedAction: string;
  generatedConstituentReply: {
    hi: string;
    en: string;
  };
}

export interface ConstituencyOverview {
  name: string;
  mpName: string;
  state: string;
  totalPopulation: number;
  totalWards: number;
  annualMpladsBudgetCr: number;
  allocatedBudgetCr: number;
  remainingBudgetCr: number;
  totalGrievancesThisMonth: number;
  resolvedGrievancesThisMonth: number;
  avgSlaDays: number;
  citizenSatisfactionRate: number; // Percentage
}

export const INITIAL_CONSTITUENCY_OVERVIEW: ConstituencyOverview = {
  name: "Varanasi South & Central Constituency",
  mpName: "Dr. Rajeshwar Sharma, MP",
  state: "Uttar Pradesh",
  totalPopulation: 485000,
  totalWards: 6,
  annualMpladsBudgetCr: 7.5,
  allocatedBudgetCr: 4.8,
  remainingBudgetCr: 2.7,
  totalGrievancesThisMonth: 342,
  resolvedGrievancesThisMonth: 289,
  avgSlaDays: 3.2,
  citizenSatisfactionRate: 91.4,
};

export const INITIAL_WARDS: WardData[] = [
  {
    id: "ward-1",
    name: "Ward 1 - Dashashwamedh Heritage Belt",
    code: "W-01",
    population: 82000,
    bplPercentage: 34.5,
    literacyRate: 78.2,
    infrastructureScore: 62,
    waterAccessScore: 58,
    sanitationIndex: 52,
    roadQualityScore: 68,
    healthcareDensity: 1.8,
    activeGrievanceCount: 48,
    budgetAllocatedCr: 0.85,
    recommendedBudgetCr: 1.25,
    urgentNeeds: ["Drainage De-silting", "Public Sanitation Complex", "Heritage Pathway Repair"]
  },
  {
    id: "ward-2",
    name: "Ward 2 - Assi & Lanka Knowledge Hub",
    code: "W-02",
    population: 95000,
    bplPercentage: 18.2,
    literacyRate: 92.4,
    infrastructureScore: 84,
    waterAccessScore: 88,
    sanitationIndex: 81,
    roadQualityScore: 86,
    healthcareDensity: 4.2,
    activeGrievanceCount: 22,
    budgetAllocatedCr: 0.60,
    recommendedBudgetCr: 0.55,
    urgentNeeds: ["Solar Streetlights", "Student Library Hub", "Traffic Signal Automation"]
  },
  {
    id: "ward-3",
    name: "Ward 3 - Chowk & Silk Weaver Cluster",
    code: "W-03",
    population: 78000,
    bplPercentage: 42.1,
    literacyRate: 71.5,
    infrastructureScore: 48,
    waterAccessScore: 45,
    sanitationIndex: 44,
    roadQualityScore: 52,
    healthcareDensity: 1.2,
    activeGrievanceCount: 65,
    budgetAllocatedCr: 0.70,
    recommendedBudgetCr: 1.40,
    urgentNeeds: ["High-Tension Wire Undergrounding", "Weaver Common Facility Center", "Primary Health Clinic"]
  },
  {
    id: "ward-4",
    name: "Ward 4 - Sigra & Cantonment Zone",
    code: "W-04",
    population: 71000,
    bplPercentage: 15.0,
    literacyRate: 89.0,
    infrastructureScore: 78,
    waterAccessScore: 82,
    sanitationIndex: 79,
    roadQualityScore: 80,
    healthcareDensity: 3.5,
    activeGrievanceCount: 19,
    budgetAllocatedCr: 0.90,
    recommendedBudgetCr: 0.70,
    urgentNeeds: ["Stormwater Drainage", "Public Park Renovation", "EV Charging Point"]
  },
  {
    id: "ward-5",
    name: "Ward 5 - Shivpur Peri-Urban Sector",
    code: "W-05",
    population: 92000,
    bplPercentage: 38.8,
    literacyRate: 74.0,
    infrastructureScore: 51,
    waterAccessScore: 49,
    sanitationIndex: 48,
    roadQualityScore: 46,
    healthcareDensity: 1.0,
    activeGrievanceCount: 57,
    budgetAllocatedCr: 0.95,
    recommendedBudgetCr: 1.65,
    urgentNeeds: ["Clean Drinking Water Overhead Tank", "Connecting Link Road", "Anganwadi Upgrade"]
  },
  {
    id: "ward-6",
    name: "Ward 6 - Ramnagar Riverfront Extension",
    code: "W-06",
    population: 67000,
    bplPercentage: 36.2,
    literacyRate: 76.8,
    infrastructureScore: 56,
    waterAccessScore: 53,
    sanitationIndex: 50,
    roadQualityScore: 55,
    healthcareDensity: 1.5,
    activeGrievanceCount: 39,
    budgetAllocatedCr: 0.80,
    recommendedBudgetCr: 1.15,
    urgentNeeds: ["River Erosion Embankment", "Solid Waste Segregation Plant", "Community Hall"]
  }
];

export const INITIAL_GRIEVANCES: Grievance[] = [
  {
    id: "griev-101",
    ticketId: "LOK-2026-0841",
    createdAt: "2026-08-22T09:15:00Z",
    citizenName: "Rameshwar Prasad Weaver",
    phone: "+91 98390 12345",
    source: "SCANNED_LETTER",
    rawInput: "आदरणीय सांसद जी, चौक रेशम बुनकर वार्ड नंबर 3 में पिछले 12 दिनों से मुख्य सीवर लाइन पूरी तरह बंद है। गंदा पानी सड़कों पर फैल रहा है जिससे पावरलूम और करघों पर काम करना असंभव हो गया है। लगभग 250 बुनकर परिवारों का रोजगार प्रभावित है। डेंगू फैलने का भारी खतरा है। जल कल विभाग को 4 बार लिखित शिकायत दी पर कोई कार्रवाई नहीं हुई। कृपया तुरंत सुपर-सकर मशीन भिजवाकर राहत प्रदान करें।",
    category: "Water & Sanitation",
    priority: "CRITICAL",
    status: "DISPATCHED",
    wardId: "ward-3",
    wardName: "Ward 3 - Chowk & Silk Weaver Cluster",
    locationDetails: "Gali No. 4, Handloom Mohalla, Chowk",
    sentiment: "VERY_NEGATIVE",
    sentimentScore: -0.88,
    aiSummary: "Severe sewer blockage in Ward 3 affecting 250 weaver households and looms for 12 days. High risk of disease outbreak. Jal Kal Dept un-responsive.",
    aiKeyEntities: {
      location: "Gali No. 4, Handloom Mohalla, Ward 3",
      affectedCount: "250 Weaver Families (~1,200 citizens)",
      urgencyReason: "Dengue risk & livelihood disruption for 12 days",
      department: "Varanasi Nagar Nigam & Jal Sansthan"
    },
    assignedDepartment: "Municipal Sanitation & Jal Kal Division",
    officerInCharge: "Er. Anil Kumar Verma (Exec Engineer)",
    slaDays: 1,
    aiSuggestedAction: "Dispatch emergency jetting/super-sucker machine within 4 hours. Sanction fast-track pipeline desilting under Ward Urgent Repairs Fund.",
    generatedConstituentReply: {
      hi: "प्रिय रामेश्वर प्रसाद जी, आपकी शिकायत (टिकट #LOK-2026-0841) पर सांसद कार्यालय द्वारा तुरंत संज्ञान लिया गया है। जल कल विभाग के अधिशासी अभियंता इं. अनिल वर्मा को 4 घंटे में सुपर-सकर मशीन भेजने और सीवर लाइन साफ करने का कड़ा निर्देश दिया गया है। निगरानी हेतु नोडल अधिकारी तैनात है।",
      en: "Dear Rameshwar Prasad ji, your grievance (Ticket #LOK-2026-0841) has been escalated by the MP Office on top priority. Executive Engineer Er. Anil Verma has been instructed to deploy jetting machines within 4 hours. A nodal officer is tracking resolution."
    }
  },
  {
    id: "griev-102",
    ticketId: "LOK-2026-0842",
    createdAt: "2026-08-22T07:45:00Z",
    citizenName: "Smt. Sunita Devi",
    phone: "+91 94152 87654",
    source: "VOICE_NOTE",
    rawInput: "[Transcript of audio note recorded at Ward 5 Shivpur Chowk]: Namaste MP Sir, hum Shivpur Ward 5 se bol rahe hain. Yahan primary school ke paas wala rasta completely toota hua hai aur raat ko koi streetlight nahi jalti. Pichle hafte do school bache dark me gir kar chotil ho gaye. Barish me paani bhar jata hai. Kripya naye LED light aur sadak marammat karwayein.",
    category: "Roads & Public Works",
    priority: "HIGH",
    status: "AI_PROCESSED",
    wardId: "ward-5",
    wardName: "Ward 5 - Shivpur Peri-Urban Sector",
    locationDetails: "Near Primary School Main Approach Road, Shivpur",
    sentiment: "NEGATIVE",
    sentimentScore: -0.65,
    aiSummary: "Broken approach road and missing streetlights near primary school in Ward 5. Hazards causing injuries to children during nighttime and monsoon waterlogging.",
    aiKeyEntities: {
      location: "Primary School Approach Road, Ward 5 Shivpur",
      affectedCount: "350+ School Children & Local Residents",
      urgencyReason: "Child safety hazard & dark spot accidents",
      department: "Public Works Dept (PWD) & Streetlight Cell"
    },
    assignedDepartment: "PWD Road Construction & Municipal Electrical Dept",
    officerInCharge: "Shri S. P. Tripathi (Assistant Engineer)",
    slaDays: 3,
    aiSuggestedAction: "Approve installation of 8 Solar/LED street poles under Ward Infrastructure Upgrade fund and patch main pothole stretch within 72 hours.",
    generatedConstituentReply: {
      hi: "आदरणीय सुनीता देवी जी, शिवपुर प्राथमिक विद्यालय मार्ग पर स्ट्रीटलाइट एवं सड़क मरम्मत का टिकट #LOK-2026-0842 दर्ज कर लिया गया है। विद्युत विभाग को तुरंत LED पोल लगाने एवं PWD को गड्ढा भरने का आदेश जारी कर दिया गया है।",
      en: "Respected Sunita Devi ji, ticket #LOK-2026-0842 regarding Shivpur school road repairs and streetlights has been logged. Instructions issued to install LED lights and repair potholes within 3 days."
    }
  },
  {
    id: "griev-103",
    ticketId: "LOK-2026-0843",
    createdAt: "2026-08-21T14:20:00Z",
    citizenName: "Dr. Alok Nath Pandey",
    phone: "+91 97921 55432",
    source: "WHATSAPP",
    rawInput: "Respected Member of Parliament, Dashashwamedh Ward 1 community health centre has been facing acute shortage of essential typhoid & anti-rabies vaccines for 3 weeks. Patients arriving from rural patches are being turned away. Request urgent intervention with Chief Medical Officer.",
    category: "Healthcare",
    priority: "HIGH",
    status: "IN_PROGRESS",
    wardId: "ward-1",
    wardName: "Ward 1 - Dashashwamedh Heritage Belt",
    locationDetails: "Community Health Centre, Dashashwamedh",
    sentiment: "NEGATIVE",
    sentimentScore: -0.58,
    aiSummary: "Acute shortage of essential typhoid and anti-rabies vaccines at Dashashwamedh CHC for 3 weeks affecting incoming rural patients.",
    aiKeyEntities: {
      location: "CHC Dashashwamedh, Ward 1",
      affectedCount: "80+ Daily Outpatients",
      urgencyReason: "Essential vaccine stock-out",
      department: "Chief Medical Office (CMO) Varanasi"
    },
    assignedDepartment: "District Health Society & CMO Office",
    officerInCharge: "Dr. Sandeep Nigam (CMO)",
    slaDays: 2,
    aiSuggestedAction: "Issue immediate requisition order to District Drug Store to restock 500 vials of anti-rabies & typhoid vaccines to Ward 1 CHC.",
    generatedConstituentReply: {
      hi: "डॉ. आलोक नाथ जी, दशाश्वमेध सीएचसी में वैक्सीन किल्लत की आपकी शिकायत (#LOK-2026-0843) पर मुख्य चिकित्सा अधिकारी (CMO) से वार्ता की गई है। आज सायं तक 500 वायल एंटी-रेबीज एवं आवश्यक दवाएं अस्पताल पहुंचा दी जाएंगी।",
      en: "Dr. Alok Nath ji, regarding vaccine shortages at Dashashwamedh CHC (#LOK-2026-0843), CMO has been directed to transfer 500 vials of emergency vaccines by this evening."
    }
  },
  {
    id: "griev-104",
    ticketId: "LOK-2026-0844",
    createdAt: "2026-08-20T11:10:00Z",
    citizenName: "Anand Gupta",
    phone: "+91 98899 43210",
    source: "SOCIAL_MEDIA",
    rawInput: "@MPVaranasi Office tag: In Ward 6 Ramnagar near Ghat road, garbage collection truck hasn't visited for 5 days. Open dump creating stench for tourists and pilgrims. Please fix @NagarNigam Vns.",
    category: "Water & Sanitation",
    priority: "MEDIUM",
    status: "RESOLVED",
    wardId: "ward-6",
    wardName: "Ward 6 - Ramnagar Riverfront Extension",
    locationDetails: "Ghat Main Road, Ramnagar",
    sentiment: "NEGATIVE",
    sentimentScore: -0.42,
    aiSummary: "Garbage collection disruption near Ramnagar Ghat road for 5 days creating public nuisance.",
    aiKeyEntities: {
      location: "Ramnagar Ghat Road, Ward 6",
      affectedCount: "Local shopkeepers & Pilgrims",
      urgencyReason: "Solid waste accumulation near tourist hub",
      department: "Solid Waste Management Cell"
    },
    assignedDepartment: "Municipal Sanitation Department",
    officerInCharge: "Shri Vikas Yadav (Sanitation Inspector)",
    slaDays: 1,
    aiSuggestedAction: "Clear accumulated waste using tipper trucks and reinstate daily morning doorstep pickup schedule.",
    generatedConstituentReply: {
      hi: "आनंद गुप्ता जी, आपकी शिकायत पर रामनगर घाट मार्ग की पूर्ण सफाई करा दी गई है तथा दैनिक कचरा उठान वाहन की समयसारणी बहाल कर दी गई है। स्वच्छ वाराणसी!",
      en: "Anand Gupta ji, the waste accumulation at Ramnagar Ghat road has been completely cleared and daily garbage vehicle schedule reinstated. Thank you!"
    }
  }
];

export interface ProjectData {
  id: string;
  name: string;
  wardId: string;
  wardName: string;
  category: 'SANITATION' | 'ROADS' | 'HEALTHCARE' | 'ELECTRICITY' | 'EDUCATION' | 'WATER';
  sanctionedBudgetCr: number;
  spentBudgetCr: number;
  progressPercentage: number;
  contractorName: string;
  startDate: string;
  targetCompletionDate: string;
  status: 'PROPOSED' | 'SANCTIONED' | 'IN_PROGRESS' | 'COMPLETED' | 'HALTED';
  description: string;
}

export interface GovernanceMember {
  id: string;
  name: string;
  role: 'MP' | 'COLLECTOR' | 'ENGINEER' | 'COUNCILLOR' | 'CITIZEN' | 'ADMIN';
  title: string;
  department: string;
  phone: string;
  email: string;
  wardId?: string;
  wardName?: string;
  activeStatus: boolean;
}

export const INITIAL_MEMBERS: GovernanceMember[] = [
  {
    id: "mem-1",
    name: "Dr. R. Sharma",
    role: "MP",
    title: "Member of Parliament (MP)",
    department: "Lok Sabha Constituency Office",
    phone: "+91 98111 00001",
    email: "mp.office@lokseva.gov.in",
    activeStatus: true
  },
  {
    id: "mem-2",
    name: "Shri S. K. Roy, IAS",
    role: "COLLECTOR",
    title: "District Magistrate & Collector",
    department: "District Revenue & Administration Dept",
    phone: "+91 98111 00002",
    email: "dm.varanasi@up.gov.in",
    activeStatus: true
  },
  {
    id: "mem-3",
    name: "Er. A. K. Verma",
    role: "ENGINEER",
    title: "Chief Executive Engineer",
    department: "Public Works Department (PWD)",
    phone: "+91 98111 00003",
    email: "ce.pwd@up.gov.in",
    activeStatus: true
  },
  {
    id: "mem-4",
    name: "Smt. Priya Gupta",
    role: "COUNCILLOR",
    title: "Ward 3 Councillor",
    department: "Varanasi Nagar Nigam (Ward 3 Cell)",
    phone: "+91 98111 00004",
    email: "ward3.councillor@nagarnigam.vns.in",
    wardId: "ward-3",
    wardName: "Ward 3 - Chowk Cluster",
    activeStatus: true
  }
];

export const INITIAL_PROJECTS: ProjectData[] = [
  {
    id: "proj-1",
    name: "Ward 3 Main Drainage Pipeline Desilting & Upgrade",
    wardId: "ward-3",
    wardName: "Ward 3 - Chowk & Silk Weaver Cluster",
    category: "SANITATION",
    sanctionedBudgetCr: 1.25,
    spentBudgetCr: 0.45,
    progressPercentage: 40,
    contractorName: "Purvanchal Infra Works Ltd",
    startDate: "2026-08-01",
    targetCompletionDate: "2026-09-15",
    status: "IN_PROGRESS",
    description: "Emergency pipeline desilting and storm drain widening to eliminate monsoon waterlogging."
  },
  {
    id: "proj-2",
    name: "Shivpur Primary School Smart Approach Road & Solar Lighting",
    wardId: "ward-5",
    wardName: "Ward 5 - Shivpur Peri-Urban Sector",
    category: "ROADS",
    sanctionedBudgetCr: 0.85,
    spentBudgetCr: 0.20,
    progressPercentage: 25,
    contractorName: "VNS City Projects Pvt Ltd",
    startDate: "2026-08-10",
    targetCompletionDate: "2026-09-30",
    status: "IN_PROGRESS",
    description: "Construction of 1.2km all-weather CC road and installation of 15 LED solar poles."
  }
];
