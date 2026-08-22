export interface Scheme {
  id: string;
  code: string;
  name: {
    en: string;
    hi: string;
  };
  category: 'AGRICULTURE' | 'HEALTHCARE' | 'HOUSING' | 'FINANCE_LOANS' | 'EDUCATION_SKILLS' | 'WOMEN_CHILD' | 'INFRASTRUCTURE';
  targetAudience: string;
  keyBenefits: string[];
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  applyLink: string;
  nodalMinistry: string;
  summary: {
    en: string;
    hi: string;
  };
  tags: string[];
}

export const PUBLIC_SCHEMES_DATABASE: Scheme[] = [
  {
    id: "scheme-pmkisan",
    code: "PM-KISAN",
    name: {
      en: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      hi: "प्रधानमंत्री किसान सम्मान निधि (PM-किसान)"
    },
    category: "AGRICULTURE",
    targetAudience: "Small and marginal farmers owning cultivable land up to 2 hectares.",
    keyBenefits: [
      "₹6,000 direct income support per year in 3 equal installments of ₹2,000.",
      "Direct Benefit Transfer (DBT) straight to Aadhaar-seeded bank account.",
      "Zero middleman commission."
    ],
    eligibilityCriteria: [
      "Landholding farmer families with cultivable land in land records.",
      "Excludes institutional landholders, high-income taxpayers, and retired government employees with monthly pension > ₹10,000."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Landholding Ownership Papers (Khatauni/Khasra)",
      "Aadhaar-linked Bank Account Passbook",
      "Mobile Number"
    ],
    applyLink: "https://pmkisan.gov.in",
    nodalMinistry: "Ministry of Agriculture & Farmers Welfare",
    summary: {
      en: "Provides financial assistance of ₹6,000 annually to land-holding farmer families across India for agricultural inputs and household needs.",
      hi: "सभी भूमिधारक किसान परिवारों को कृषि इनपुट और घरेलू जरूरतों के लिए प्रति वर्ष ₹6,000 की वित्तीय सहायता प्रदान करता है।"
    },
    tags: ["farmer", "kisan", "direct benefit", "agriculture", "money", "6000", "crop", "land"]
  },
  {
    id: "scheme-ayushman",
    code: "PM-JAY",
    name: {
      en: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
      hi: "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (PM-JAY)"
    },
    category: "HEALTHCARE",
    targetAudience: "Poor, vulnerable families based on SECC 2011 demographic data and senior citizens aged 70+.",
    keyBenefits: [
      "Free health coverage up to ₹5,00,000 per family per year.",
      "Cashless and paperless access to medical services in public and empaneled private hospitals.",
      "Covers over 1,900 medical procedures including surgeries, ICU, and diagnostics."
    ],
    eligibilityCriteria: [
      "Families listed under Socio-Economic Caste Census (SECC 2011) or holding Ayushman Vaya Vandana card for 70+ seniors.",
      "No restriction on family size, age, or gender."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Ration Card / PM-JAY Letter",
      "Mobile Number for OTP Verification"
    ],
    applyLink: "https://beneficiary.nha.gov.in",
    nodalMinistry: "National Health Authority & Ministry of Health",
    summary: {
      en: "World's largest health assurance scheme giving cashless treatment up to ₹5 Lakhs annually for secondary and tertiary hospitalization.",
      hi: "द्वितीयक और तृतीयक अस्पताल में भर्ती के लिए प्रति वर्ष ₹5 लाख तक का कैशलेस इलाज देने वाली दुनिया की सबसे बड़ी स्वास्थ्य बीमा योजना।"
    },
    tags: ["health", "hospital", "card", "5 lakh", "insurance", "ayushman", "doctor", "treatment", "bimar"]
  },
  {
    id: "scheme-pmay",
    code: "PMAY-U/R",
    name: {
      en: "Pradhan Mantri Awas Yojana (PMAY)",
      hi: "प्रधानमंत्री आवास योजना (PMAY)"
    },
    category: "HOUSING",
    targetAudience: "Homeless households and those living in kutcha/dilapidated houses in rural & urban areas.",
    keyBenefits: [
      "Financial grant up to ₹1.20 Lakh to ₹2.50 Lakh for building a pucca house with toilet, LPG, and tap water.",
      "Credit-Linked Subsidy Scheme (CLSS) interest subsidy on home loans for EWS/LIG families."
    ],
    eligibilityCriteria: [
      "Family must not own a pucca house anywhere in India.",
      "Annual household income within EWS (up to ₹3 Lakh) or LIG (up to ₹6 Lakh) limits."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Income Certificate",
      "Land Ownership Document or Allotment Certificate",
      "Bank Account details"
    ],
    applyLink: "https://pmaymis.gov.in",
    nodalMinistry: "Ministry of Housing and Urban Affairs / Ministry of Rural Development",
    summary: {
      en: "Ensures 'Housing for All' by giving direct financial grants and interest subsidies to construct durable pucca houses.",
      hi: "पक्का मकान बनाने के लिए सीधी वित्तीय अनुदान राशि और ब्याज सब्सिडी देकर 'सबके लिए आवास' सुनिश्चित करता है।"
    },
    tags: ["house", "home", "makan", "pucca house", "construction", "subsidy", "awas"]
  },
  {
    id: "scheme-pmsvanidhi",
    code: "PM-SVANidhi",
    name: {
      en: "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
      hi: "प्रधानमंत्री स्ट्रीट वेंडर्स आत्मनिर्भर निधि (PM स्वनिधि)"
    },
    category: "FINANCE_LOANS",
    targetAudience: "Street vendors, hawkers, cobblers, fruit/vegetable sellers operating in urban & peri-urban areas.",
    keyBenefits: [
      "Collateral-free working capital loan starting at ₹10,000, progressing to ₹20,000 and ₹50,000 on timely repayment.",
      "7% annual interest subsidy deposited directly in bank account.",
      "Cashback up to ₹1,200 per year on digital transactions."
    ],
    eligibilityCriteria: [
      "Street vendors with Certificate of Vending / Identity Card issued by Urban Local Bodies (ULBs).",
      "Vendors who have been vending on or before March 24, 2020."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Vending Certificate or ULB Recommendation Letter",
      "Aadhaar-linked Bank Account"
    ],
    applyLink: "https://pmsvanidhi.mohua.gov.in",
    nodalMinistry: "Ministry of Housing and Urban Affairs",
    summary: {
      en: "Micro-credit scheme providing collateral-free working capital loans up to ₹50,000 to street vendors with interest subsidies.",
      hi: "स्ट्रीट वेंडरों और रेहड़ी-पटरी वालों को ब्याज सब्सिडी के साथ ₹50,000 तक का बिना गारंटी कार्यशील पूंजी ऋण देने वाली योजना।"
    },
    tags: ["loan", "vendor", "street vendor", "hawker", "rehri", "dukan", "business loan", "svanidhi"]
  },
  {
    id: "scheme-vishwakarma",
    code: "PM-VISHWAKARMA",
    name: {
      en: "PM Vishwakarma Yojana",
      hi: "पीएम विश्वकर्मा योजना"
    },
    category: "EDUCATION_SKILLS",
    targetAudience: "Traditional artisans and craftspeople working with hands and tools (18 traditional trades).",
    keyBenefits: [
      "Recognition via Vishwakarma Certificate & ID card.",
      "Basic & Advanced Skill Training with ₹500/day stipend during training.",
      "Toolkit Incentive grant of ₹15,000.",
      "Collateral-free enterprise loan up to ₹3 Lakhs at concessional 5% interest rate."
    ],
    eligibilityCriteria: [
      "Artisans in traditional trades like Carpenter, Blacksmith, Weaver, Sculptor, Goldsmith, Potter, Cobbler, Tailor, Barber, Mason, etc.",
      "Minimum age 18 years; restricted to one member per family."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Bank Passbook",
      "Ration Card & Mobile number"
    ],
    applyLink: "https://pmvishwakarma.gov.in",
    nodalMinistry: "Ministry of Micro, Small and Medium Enterprises (MSME)",
    summary: {
      en: "Comprehensive financial, skill, and toolkit support for traditional artisans across 18 craft categories.",
      hi: "18 पारंपरिक शिल्प श्रेणियों में पारंपरिक कारीगरों और शिल्पकारों को वित्तीय, कौशल और टूलकिट सहायता प्रदान करता है।"
    },
    tags: ["artisan", "karigar", "carpenter", "tailor", "weaver", "bunkar", "toolkit", "skill loan", "vishwakarma"]
  },
  {
    id: "scheme-jaljeevan",
    code: "JJM",
    name: {
      en: "Jal Jeevan Mission (Har Ghar Jal)",
      hi: "जल जीवन मिशन (हर घर जल)"
    },
    category: "INFRASTRUCTURE",
    targetAudience: "All rural and peri-urban households seeking functional household tap connections (FHTC).",
    keyBenefits: [
      "Provision of safe and adequate drinking water through individual household tap connection (55 liters per capita per day).",
      "Water quality testing kits and Village Water & Sanitation Committee oversight."
    ],
    eligibilityCriteria: [
      "All rural households without existing piped tap water connections."
    ],
    requiredDocuments: [
      "Household ID / Ration Card",
      "Aadhaar of Head of Household"
    ],
    applyLink: "https://ejalshakti.gov.in",
    nodalMinistry: "Ministry of Jal Shakti",
    summary: {
      en: "Aims to provide safe tap water connection to every rural household and public institution across India.",
      hi: "भारत के प्रत्येक ग्रामीण परिवार और सार्वजनिक संस्थान को सुरक्षित नल का पानी कनेक्शन प्रदान करने का लक्ष्य।"
    },
    tags: ["water", "tap water", "jal", "paani", "drinking water", "pipe", "jjm", "nal"]
  }
];
