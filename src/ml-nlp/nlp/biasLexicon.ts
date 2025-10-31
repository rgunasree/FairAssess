export type BiasCategory =
  | "Gender Bias"
  | "Age Bias"
  | "Cultural Bias"
  | "Racial Bias"
  | "Religious Bias"
  | "Ableist Language"
  | "LGBTQ+ Bias"
  | "Socioeconomic Bias"

export type LexiconEntry = {
  pattern: RegExp
  suggestions: string[]
  weight: number // severity weight 0-1
}

export const biasLexicon: Record<BiasCategory, LexiconEntry[]> = {
  "Gender Bias": [
    { pattern: /\b(aggressive)\b/gi, suggestions: ["assertive", "decisive"], weight: 0.7 },
    { pattern: /\b(dominant|rock\s?star|ninja)\b/gi, suggestions: ["lead", "expert"], weight: 0.6 },
    { pattern: /\b(ambitious)\b/gi, suggestions: ["goal-oriented"], weight: 0.4 },
    { pattern: /\b(he|him)\b/gi, suggestions: ["they", "the candidate"], weight: 0.5 },
  ],
  "Age Bias": [
    { pattern: /\b(digital\s?native)\b/gi, suggestions: ["tech-savvy individual"], weight: 0.8 },
    { pattern: /\b(young|youthful|energetic)\b/gi, suggestions: ["motivated", "high-energy"], weight: 0.7 },
    { pattern: /\b(overqualified)\b/gi, suggestions: ["experienced"], weight: 0.5 },
  ],
  "Cultural Bias": [
    { pattern: /\b(native\s+english\s+speaker)\b/gi, suggestions: ["fluent in English"], weight: 0.9 },
    { pattern: /\b(american\s+accent|no\s+accent)\b/gi, suggestions: ["clear communication"], weight: 0.8 },
  ],
  "Racial Bias": [
    { pattern: /\b(clean\s+cut)(\s+look)?\b/gi, suggestions: ["professional appearance"], weight: 0.6 },
  ],
  "Religious Bias": [
    { pattern: /\b(christian\s+values)\b/gi, suggestions: ["ethical standards"], weight: 0.9 },
  ],
  "Ableist Language": [
    { pattern: /\b(crazy|insane)\b/gi, suggestions: ["unexpected", "unusual"], weight: 0.6 },
    { pattern: /\b(handicap(ped)?)\b/gi, suggestions: ["person with a disability"], weight: 0.8 },
  ],
  "LGBTQ+ Bias": [
    { pattern: /\b(married\s+man|wife\s+and\s+kids)\b/gi, suggestions: ["has a family"], weight: 0.6 },
  ],
  "Socioeconomic Bias": [
    { pattern: /\b(owns\s+a\s+car)\b/gi, suggestions: ["reliable transportation"], weight: 0.5 },
  ],
}

export function applySuggestions(text: string, examples: string[], suggestions: string[]): string {
  let improved = text
  for (let i = 0; i < examples.length; i++) {
    const ex = examples[i]
    const sug = suggestions[i] || suggestions[0] || ex
    const re = new RegExp(ex.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")
    improved = improved.replace(re, sug)
  }
  return improved
}
