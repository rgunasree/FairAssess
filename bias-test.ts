import * as fs from 'fs'

type BiasCategory =
  | "Gender Bias"
  | "Age Bias"
  | "Cultural Bias"
  | "Racial Bias"
  | "Religious Bias"
  | "Ableist Language"
  | "LGBTQ+ Bias"
  | "Socioeconomic Bias"

type LexiconEntry = {
  pattern: RegExp
  suggestions: string[]
  weight: number
}

const biasLexicon: Record<BiasCategory, LexiconEntry[]> = {
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

function applySuggestions(text: string, examples: string[], suggestions: string[]): string {
  let improved = text
  for (let i = 0; i < examples.length; i++) {
    const ex = examples[i]
    const sug = suggestions[i] || suggestions[0] || ex
    const re = new RegExp(ex.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")
    improved = improved.replace(re, sug)
  }
  return improved
}

type BiasFinding = {
  type: BiasCategory
  confidence: number
  examples: string[]
  suggestions: string[]
}

type AnalysisResult = {
  originalText: string
  fairnessScore: number
  biasTypes: BiasFinding[]
  improvedText: string
}

function analyzeText(text: string): AnalysisResult {
  const findings: BiasFinding[] = []
  let penalty = 0
  let improvedText = text

  for (const [category, entries] of Object.entries(biasLexicon) as [BiasCategory, typeof biasLexicon[BiasCategory]][]) {
    const foundExamples: string[] = []
    const foundSuggestions: string[] = []
    let maxWeight = 0

    for (const entry of entries) {
      const matches = text.match(entry.pattern)
      if (matches && matches.length > 0) {
        maxWeight = Math.max(maxWeight, entry.weight)
        for (const m of matches) {
          const lower = m.toLowerCase().trim()
          if (!foundExamples.some((e) => e.toLowerCase().trim() === lower)) {
            foundExamples.push(m)
            foundSuggestions.push(entry.suggestions[0] || m)
          }
        }
      }
    }

    if (foundExamples.length > 0) {
      const confidence = Math.min(1, 0.5 + maxWeight)
      findings.push({ type: category, confidence, examples: foundExamples, suggestions: foundSuggestions })
      penalty += foundExamples.length * (0.5 + maxWeight) * 5
      improvedText = applySuggestions(improvedText, foundExamples, foundSuggestions)
    }
  }

  const fairnessScore = Math.max(0, Math.min(100, 100 - Math.round(penalty)))

  return {
    originalText: text,
    fairnessScore,
    biasTypes: findings.sort((a, b) => b.confidence - a.confidence),
    improvedText,
  }
}

// Read and analyze the test content
const content = fs.readFileSync('./test-content.txt', 'utf-8')
const result = analyzeText(content)

console.log('\nOriginal Text:')
console.log(content)
console.log('\nBias Score:', result.fairnessScore)
console.log('\nBias Types Found:')
result.biasTypes.forEach(bias => {
  console.log(`\n- ${bias.type}:`)
  console.log('  Examples:', bias.examples.join(', '))
  console.log('  Suggestions:', bias.suggestions.join(', '))
})

console.log('\nImproved Text:')
console.log(result.improvedText)