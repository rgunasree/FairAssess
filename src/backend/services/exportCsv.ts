export interface BiasIssue {
  type: string
  term?: string
  reason?: string
  suggestion?: string
}

export interface AnalysisResult {
  title?: string
  originalText: string
  improvedText?: string
  fairnessScore?: number
  biasTypes?: BiasIssue[]
  confidence?: number
  processingTime?: string
  language?: string
}

export function analysisToCSVRow(a: AnalysisResult): string {
  const bias = (a.biasTypes || []).map(b => `${b.type}:${b.term || ''}`).join('|')
  const escaped = (s: string | number | undefined) => {
    const v = (s ?? '').toString().replace(/"/g, '""')
    return `"${v}"`
  }
  return [
    escaped(a.title || ''),
    escaped(a.language || ''),
    escaped(a.fairnessScore ?? ''),
    escaped(a.originalText),
    escaped(a.improvedText || ''),
    escaped(bias),
    escaped(a.confidence ?? ''),
    escaped(a.processingTime || '')
  ].join(',')
}

export function buildCSV(results: AnalysisResult[] | AnalysisResult): string {
  const rows = Array.isArray(results) ? results : [results]
  const header = 'title,language,fairnessScore,originalText,improvedText,bias,confidence,processingTime'
  return [header, ...rows.map(analysisToCSVRow)].join('\n')
}
