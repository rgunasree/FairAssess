import { biasLexicon, type BiasCategory, applySuggestions } from "@/lib/nlp/biasLexicon"

export type BiasFinding = {
  type: BiasCategory
  confidence: number // 0-1
  examples: string[]
  suggestions: string[]
}

export type AnalysisResult = {
  originalText: string
  fairnessScore: number // 0-100
  biasTypes: BiasFinding[]
  improvedText: string
}

export function analyzeTextLocal(text: string): AnalysisResult {
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
        // Deduplicate examples case-insensitively
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
      penalty += foundExamples.length * (0.5 + maxWeight) * 5 // each example costs some points
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
