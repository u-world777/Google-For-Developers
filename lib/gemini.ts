import { GoogleGenAI } from '@google/genai';
import { Grievance, WardData } from './constituency-data';
import { searchSchemesRAG } from './rag-engine';

export function getStoredApiKey(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('lokseva_gemini_api_key') || process.env.NEXT_PUBLIC_GEMINI_API_KEY || null;
  }
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || null;
}

export function setStoredApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('lokseva_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('lokseva_gemini_api_key');
    }
  }
}

export interface BudgetAllocationItem {
  wardId: string;
  wardCode: string;
  wardName: string;
  allocatedAmountCr: number;
  povertyIndex: number;
  infraScore: number;
  rationale: string;
  topProject: string;
}

export interface BudgetAllocationPlan {
  allocations: BudgetAllocationItem[];
  strategicRationale: string;
}

/**
 * 1. AI Grievance Classification & Processing Engine
 */
export async function processGrievanceWithAI(
  rawInput: string,
  source: Grievance['source'],
  citizenName: string,
  wardName: string
): Promise<Partial<Grievance>> {
  const apiKey = getStoredApiKey();

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are LokSeva AI, an official Digital Public Infrastructure assistant for local governance and Members of Parliament in India.
Analyze the following citizen complaint/letter/voice transcript:

Citizen Name: ${citizenName}
Ward: ${wardName}
Channel: ${source}
Input Text: "${rawInput}"

Respond strictly with valid JSON with these keys:
{
  "category": "Water & Sanitation" | "Roads & Public Works" | "Healthcare" | "Electricity & Energy" | "Education" | "Social Welfare & Pensions" | "Housing" | "Public Safety",
  "priority": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "sentiment": "VERY_NEGATIVE" | "NEGATIVE" | "NEUTRAL" | "POSITIVE",
  "sentimentScore": number between -1.0 and 1.0,
  "aiSummary": "1-2 sentence English executive summary of problem & impact",
  "assignedDepartment": "Name of relevant local municipal/govt department",
  "officerInCharge": "Suggested officer designation e.g. Er. Executive Engineer",
  "slaDays": number (days to resolve e.g. 1 for critical, 3 for high, 5 for medium),
  "locationDetails": "Extracted location from text or general ward area",
  "aiKeyEntities": {
    "location": "extracted location",
    "affectedCount": "estimated affected citizens e.g. 200 families",
    "urgencyReason": "why it needs urgent attention",
    "department": "department name"
  },
  "aiSuggestedAction": "Actionable 1-line step for the MP/Officer to resolve",
  "generatedConstituentReply": {
    "hi": "Polite official reply in Hindi with ticket number placeholder #TICKET_ID",
    "en": "Polite official reply in English with ticket number placeholder #TICKET_ID"
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);
      return parsed;
    } catch (err) {
      console.warn("Gemini API call failed, falling back to local NLP heuristics:", err);
    }
  }

  // Smart Fallback Local Heuristics Logic
  const inputLower = rawInput.toLowerCase();
  let category: Grievance['category'] = 'Roads & Public Works';
  let priority: Grievance['priority'] = 'MEDIUM';
  let assignedDepartment = 'Public Works Department (PWD)';
  let officerInCharge = 'Shri K. P. Singh (Assistant Engineer)';
  let slaDays = 3;

  if (inputLower.includes('sewer') || inputLower.includes('water') || inputLower.includes('drain') || inputLower.includes('paani') || inputLower.includes('कचरा') || inputLower.includes('सीवर') || inputLower.includes('जल')) {
    category = 'Water & Sanitation';
    priority = inputLower.includes('urgent') || inputLower.includes('disease') || inputLower.includes('block') || inputLower.includes('डेंगू') ? 'CRITICAL' : 'HIGH';
    assignedDepartment = 'Municipal Sanitation & Jal Sansthan';
    officerInCharge = 'Er. Anil Kumar Verma (Executive Engineer)';
    slaDays = priority === 'CRITICAL' ? 1 : 2;
  } else if (inputLower.includes('doctor') || inputLower.includes('vaccine') || inputLower.includes('hospital') || inputLower.includes('dawa') || inputLower.includes('अस्पताल')) {
    category = 'Healthcare';
    priority = 'HIGH';
    assignedDepartment = 'District Health Society & CMO';
    officerInCharge = 'Dr. Sandeep Nigam (CMO)';
    slaDays = 2;
  } else if (inputLower.includes('light') || inputLower.includes('electricity') || inputLower.includes('wire') || inputLower.includes('बिजली') || inputLower.includes('लाइट')) {
    category = 'Electricity & Energy';
    priority = 'MEDIUM';
    assignedDepartment = 'State Electricity Distribution Co.';
    officerInCharge = 'Shri Rajesh Gupta (SDO Electrical)';
    slaDays = 3;
  }

  return {
    category,
    priority,
    sentiment: priority === 'CRITICAL' ? 'VERY_NEGATIVE' : 'NEGATIVE',
    sentimentScore: priority === 'CRITICAL' ? -0.85 : -0.55,
    aiSummary: `Citizen complaint received regarding ${category.toLowerCase()} in ${wardName}. Ingested via ${source}.`,
    assignedDepartment,
    officerInCharge,
    slaDays,
    locationDetails: `${wardName} Main Sector`,
    aiKeyEntities: {
      location: wardName,
      affectedCount: "100+ Local Residents",
      urgencyReason: priority === 'CRITICAL' ? "High risk of public escalation & health hazard" : "Quality of civic service gap",
      department: assignedDepartment
    },
    aiSuggestedAction: `Dispatch inspection team from ${assignedDepartment} within ${slaDays} days and approve priority repair work.`,
    generatedConstituentReply: {
      hi: `प्रिय ${citizenName} जी, सांसद कार्यालय द्वारा आपकी समस्या (टिकट #TICKET_ID) दर्ज कर ली गई है। सम्बंधित अधिकारी (${officerInCharge}) को ${slaDays} दिनों के भीतर समस्या निवारण का निर्देश दिया गया है।`,
      en: `Dear ${citizenName} ji, your grievance (Ticket #TICKET_ID) has been logged by the MP office. Designated officer ${officerInCharge} has been instructed to resolve this within ${slaDays} days.`
    }
  };
}

/**
 * 2. AI Resource & Budget Allocation Simulator Engine
 */
export async function optimizeBudgetAllocationAI(
  wards: WardData[],
  totalBudgetCr: number,
  weights?: { povertyWeight: number; infraDeficitWeight: number; grievanceWeight: number }
): Promise<BudgetAllocationPlan> {
  const pWeight = weights?.povertyWeight ?? 40;
  const iWeight = weights?.infraDeficitWeight ?? 40;
  const gWeight = weights?.grievanceWeight ?? 20;

  const apiKey = getStoredApiKey();

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are LokSeva AI Budget Planning Engine for MPLADS & Ward Development Funds in India.
Available Total Annual Budget: ₹${totalBudgetCr} Crores.
Weights: Poverty Weight = ${pWeight}%, Infra Deficit Weight = ${iWeight}%, Grievance Weight = ${gWeight}%.
Wards socio-economic dataset: ${JSON.stringify(wards, null, 2)}

Calculate optimal budget allocation across wards according to the weights.
Return JSON:
{
  "allocations": [
    {
      "wardId": "ward-1",
      "wardCode": "W1",
      "wardName": "Ward Name",
      "allocatedAmountCr": number (e.g. 1.25),
      "povertyIndex": number,
      "infraScore": number,
      "rationale": "Clear data-backed reason for allocation",
      "topProject": "Highest priority infrastructure project to fund"
    }
  ],
  "strategicRationale": "3-4 sentence strategic MP briefing summarizing how this allocation balances socio-economic equity, urgent infrastructure fixes, and constituent grievance hotspots."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.allocations) {
        return parsed;
      }
    } catch (err) {
      console.warn("Gemini budget optimization failed, using local scoring algorithm:", err);
    }
  }

  // Formulaic Heuristic Budget Optimization: Score = (BPL% * pWeight) + ((100 - InfraScore) * iWeight) + (GrievanceCount * gWeight)
  const wardScores = wards.map(w => {
    const needScore = (w.bplPercentage * (pWeight / 20)) + ((100 - w.infrastructureScore) * (iWeight / 20)) + (w.activeGrievanceCount * (gWeight / 10));
    return { ward: w, needScore };
  });

  const totalScore = wardScores.reduce((acc, curr) => acc + curr.needScore, 0);

  const allocations: BudgetAllocationItem[] = wards.map(w => {
    const item = wardScores.find(s => s.ward.id === w.id)!;
    const share = totalScore > 0 ? item.needScore / totalScore : 1 / wards.length;
    const allocatedAmountCr = parseFloat((totalBudgetCr * share).toFixed(2));

    return {
      wardId: w.id,
      wardCode: w.code,
      wardName: w.name,
      allocatedAmountCr,
      povertyIndex: w.bplPercentage,
      infraScore: w.infrastructureScore,
      rationale: `Allocation weighted by BPL rate (${w.bplPercentage}%), lower infrastructure index (${w.infrastructureScore}/100), and ${w.activeGrievanceCount} active citizen tickets.`,
      topProject: w.urgentNeeds[0] || "Infrastructure Upgrade"
    };
  });

  return {
    allocations,
    strategicRationale: `The AI Allocation Engine recommends allocating ₹${totalBudgetCr} Cr based on weights (Poverty ${pWeight}%, Infra Deficit ${iWeight}%, Grievance ${gWeight}%). Priority funding is directed to Ward 3 and Ward 5 due to elevated BPL density and high grievance backlogs, while maintaining essential maintenance reserves across higher-performing wards.`
  };
}

/**
 * 3. Jan-Mitra Multi-lingual Conversational AI Agent
 */
export async function chatJanMitraAI(
  userQuery: string,
  language: 'hi' | 'en' | 'ta' | 'te' | 'bn',
  history: Array<{ role: 'user' | 'model'; parts: string }>
): Promise<{ text: string; matchedSchemes: any[]; suggestedQuestions: string[] }> {
  const ragMatches = searchSchemesRAG(userQuery);
  const apiKey = getStoredApiKey();

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are 'Jan-Mitra' (जन-मित्र), an empathetic, highly knowledgeable multi-lingual AI Voice & Chat Assistant for Indian Digital Public Infrastructure.
Target Language: ${language} (Format response in standard user-friendly ${language === 'hi' ? 'Hindi / Hinglish' : language === 'en' ? 'English' : language}).
Context Public Schemes matched from RAG Search:
${JSON.stringify(ragMatches.map(m => m.scheme), null, 2)}

User Question: "${userQuery}"

Provide a warm, accurate response answering the user's question, explaining eligible government schemes, required documents, or step-by-step application advice.
Return JSON:
{
  "text": "Your helpful response text in ${language}",
  "suggestedQuestions": ["Follow up question 1", "Follow up question 2"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(response.text || '{}');
      return {
        text: parsed.text || "Hello! I am Jan-Mitra, how can I assist you with government schemes?",
        matchedSchemes: ragMatches.slice(0, 2).map(r => r.scheme),
        suggestedQuestions: parsed.suggestedQuestions || ["How do I apply for PM-Kisan?", "What documents are required for Ayushman card?"]
      };
    } catch (err) {
      console.warn("Gemini Jan-Mitra call failed, using RAG fallback response:", err);
    }
  }

  // High-fidelity RAG Fallback
  if (ragMatches.length > 0) {
    const topScheme = ragMatches[0].scheme;
    const isHindi = language === 'hi';

    const textHi = `नमस्ते! आपकी जिज्ञासा के अनुसार **${topScheme.name.hi}** सबसे उपयुक्त सरकारी योजना है।\n\n📌 **मुख्य लाभ:**\n${topScheme.keyBenefits.map(b => `• ${b}`).join('\n')}\n\n📄 **आवश्यक दस्तावेज़:** ${topScheme.requiredDocuments.join(', ')}\n\nआप इसके लिए पोर्टल (${topScheme.applyLink}) पर या निकटतम सीएससी (CSC) जन सेवा केंद्र जाकर आवेदन कर सकते हैं।`;
    const textEn = `Hello! Based on your request, **${topScheme.name.en}** is the most relevant scheme.\n\n📌 **Key Benefits:**\n${topScheme.keyBenefits.map(b => `• ${b}`).join('\n')}\n\n📄 **Required Documents:** ${topScheme.requiredDocuments.join(', ')}\n\nYou can apply online at (${topScheme.applyLink}) or visit your nearest CSC Kendra.`;

    return {
      text: isHindi ? textHi : textEn,
      matchedSchemes: ragMatches.slice(0, 2).map(r => r.scheme),
      suggestedQuestions: isHindi
        ? [`${topScheme.code} में आवेदन की प्रक्रिया क्या है?`, "क्या इसके लिए आधार कार्ड बैंक से लिंक होना ज़रूरी है?"]
        : [`How to apply for ${topScheme.code}?`, "Is Aadhaar bank linkage mandatory?"]
    };
  }

  return {
    text: language === 'hi'
      ? "नमस्ते! मैं आपका जन-मित्र (Jan-Mitra) AI सहायक हूँ। आप मुझसे किसी भी सरकारी योजना (जैसे PM-किसान, आयुष्मान भारत, पीएम आवास, स्वनिधि) या अपने वार्ड की समस्याओं के बारे में पूछ सकते हैं।"
      : "Hello! I am Jan-Mitra AI Assistant. You can ask me about any public welfare schemes (PM-Kisan, Ayushman Bharat, PMAY, PM-SVANidhi) or local ward development updates.",
    matchedSchemes: [],
    suggestedQuestions: [
      language === 'hi' ? "मुझे ₹5 लाख तक के मुफ्त इलाज की योजना के बारे में बताएं" : "Tell me about free hospital treatment schemes up to ₹5 Lakhs",
      language === 'hi' ? "किसानों के लिए ₹6000 की सालाना सहायता कैसे मिलती है?" : "How do farmers get ₹6,000 annual support?"
    ]
  };
}

export async function processWhatsAppWithAI(incomingMessage: string, senderPhone: string = '+91 98000 WHATSAPP') {
  const processed = await processGrievanceWithAI(incomingMessage, 'WHATSAPP', 'WhatsApp User', 'Ward 3 - Chowk Cluster');
  const ticketId = `LOK-2026-W${Math.floor(100 + Math.random() * 900)}`;
  return {
    ticketId,
    replyText: processed.generatedConstituentReply?.hi || 'आपकी शिकायत दर्ज कर ली गई है।',
    category: (processed.category || 'Roads & Public Works') as Grievance['category'],
    priority: (processed.priority || 'HIGH') as Grievance['priority'],
    wardName: 'Ward 3 - Chowk Cluster',
    aiSummary: processed.aiSummary || incomingMessage,
    assignedDepartment: processed.assignedDepartment || 'Municipal Public Works Dept',
    officerInCharge: processed.officerInCharge || 'Smt. Priya Gupta (Ward 3 Councillor)',
    slaDays: processed.slaDays || 3
  };
}
