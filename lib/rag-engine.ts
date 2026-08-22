import { PUBLIC_SCHEMES_DATABASE, Scheme } from './schemes-db';
import { WardData } from './constituency-data';

// Simple TF-IDF / Keyword vector RAG engine for welfare schemes and policies
export interface RAGResult {
  scheme: Scheme;
  score: number;
  matchedReason: string;
}

export function searchSchemesRAG(query: string, userAttributes?: { age?: number; incomeBpl?: boolean; occupation?: string }): RAGResult[] {
  const normalizedQuery = query.toLowerCase();
  const tokens = normalizedQuery.split(/\s+/).filter(t => t.length > 2);

  const results: RAGResult[] = PUBLIC_SCHEMES_DATABASE.map(scheme => {
    let score = 0;
    const matchReasons: string[] = [];

    // Match tags
    scheme.tags.forEach(tag => {
      if (normalizedQuery.includes(tag)) {
        score += 30;
        matchReasons.push(`Keyword '${tag}' matched`);
      }
    });

    // Match title & code
    if (normalizedQuery.includes(scheme.code.toLowerCase())) {
      score += 50;
      matchReasons.push(`Scheme code match '${scheme.code}'`);
    }

    if (scheme.name.en.toLowerCase().includes(normalizedQuery) || scheme.name.hi.includes(normalizedQuery)) {
      score += 40;
      matchReasons.push(`Direct title match`);
    }

    // Match summary & tokens
    tokens.forEach(token => {
      if (scheme.summary.en.toLowerCase().includes(token) || scheme.summary.hi.includes(token)) {
        score += 8;
      }
      if (scheme.targetAudience.toLowerCase().includes(token)) {
        score += 10;
      }
    });

    // Attribute boosters
    if (userAttributes) {
      if (userAttributes.incomeBpl && (scheme.tags.includes("bpl") || scheme.tags.includes("subsidy") || scheme.id === "scheme-ayushman" || scheme.id === "scheme-pmay")) {
        score += 25;
        matchReasons.push("High priority for BPL household criteria");
      }
      if (userAttributes.occupation) {
        const occ = userAttributes.occupation.toLowerCase();
        if (occ.includes("farmer") || occ.includes("kisan")) {
          if (scheme.id === "scheme-pmkisan") score += 40;
        } else if (occ.includes("vendor") || occ.includes("hawker") || occ.includes("dukan")) {
          if (scheme.id === "scheme-pmsvanidhi") score += 40;
        } else if (occ.includes("artisan") || occ.includes("weaver") || occ.includes("tailor") || occ.includes("carpenter")) {
          if (scheme.id === "scheme-vishwakarma") score += 40;
        }
      }
    }

    return {
      scheme,
      score,
      matchedReason: matchReasons.length > 0 ? matchReasons.join(', ') : 'Relevant query context'
    };
  });

  return results.filter(r => r.score > 10).sort((a, b) => b.score - a.score);
}
