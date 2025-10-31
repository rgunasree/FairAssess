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

export async function buildPDFBuffer(result: AnalysisResult): Promise<Buffer> {
  const { default: PDFDocument }: any = await import('pdfkit')
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks: Buffer[] = []
    doc.on('data', (c: Buffer) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))

    doc.fontSize(18).text(result.title || 'FairAssess Report', { align: 'left' })
    doc.moveDown()
    doc.fontSize(12)

    if (typeof result.fairnessScore === 'number') {
      doc.text(`Fairness Score: ${result.fairnessScore}`)
    }
    if (result.language) {
      doc.text(`Language: ${result.language}`)
    }
    if (result.processingTime) {
      doc.text(`Processing Time: ${result.processingTime}`)
    }
    if (typeof result.confidence === 'number') {
      doc.text(`Confidence: ${Math.round(result.confidence * 100)}%`)
    }

    doc.moveDown()
    doc.fontSize(14).text('Original Text')
    doc.fontSize(11).text(result.originalText || '-', { align: 'left' })

    if (result.improvedText) {
      doc.moveDown()
      doc.fontSize(14).text('Improved Text')
      doc.fontSize(11).text(result.improvedText, { align: 'left' })
    }

    if (result.biasTypes && result.biasTypes.length) {
      doc.moveDown()
      doc.fontSize(14).text('Detected Bias')
      doc.fontSize(11)
      result.biasTypes.forEach((b, i) => {
        doc.text(`${i + 1}. [${b.type}] ${b.term || ''} - ${b.reason || ''}${b.suggestion ? ` (Suggestion: ${b.suggestion})` : ''}`)
      })
    }

    doc.end()
  })
}
