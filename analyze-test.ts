import { biasLexicon, type BiasCategory, applySuggestions } from './src/ml-nlp/nlp/biasLexicon'
import * as fs from 'fs'

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

function analyzeTextLocal(text: string): AnalysisResult {
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

async function analyze() {
  const content = fs.readFileSync('./test-content.txt', 'utf-8')
  const result = analyzeTextLocal(content)

  console.log('\nOriginal Text:')
  console.log(content)
  console.log('\nBias Score:', result.fairnessScore)
  console.log('\nBias Types Found:')
  result.biasTypes.forEach(bias => {
    console.log(`- ${bias.type}:`)
    console.log('  Examples:', bias.examples.join(', '))
    console.log('  Suggestions:', bias.suggestions.join(', '))
  })

  console.log('\nImproved Text:')
  console.log(result.improvedText)
}

analyze().catch(console.error)