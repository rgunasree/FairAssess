import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'

export type SupportedMime = 'application/pdf' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export interface ExtractedDoc {
  filename: string
  mimeType: SupportedMime
  text: string
  error?: string
}

function getExt(name: string) {
  const i = name.lastIndexOf('.')
  return i >= 0 ? name.slice(i + 1).toLowerCase() : ''
}

export async function extractTextFromBuffer(filename: string, mimeType: string, buffer: Buffer): Promise<ExtractedDoc> {
  const ext = getExt(filename)
  if (mimeType === 'application/pdf' || ext === 'pdf') {
    const data = await pdfParse(buffer)
    return { filename, mimeType: 'application/pdf', text: data.text || '' }
  }
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === 'docx'
  ) {
    const { value } = await mammoth.extractRawText({ buffer })
    return { filename, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', text: value || '' }
  }
  throw new Error(`Unsupported file type: ${mimeType || ext}`)
}

export async function extractMany(files: Array<{ filename: string; mimeType: string; buffer: Buffer }>): Promise<ExtractedDoc[]> {
  const results: ExtractedDoc[] = []
  for (const f of files) {
    try {
      const r = await extractTextFromBuffer(f.filename, f.mimeType, f.buffer)
      results.push(r)
    } catch (e: any) {
      const ext = (f.filename.split('.').pop() || '').toLowerCase()
      const mime: SupportedMime = (ext === 'pdf')
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      results.push({ filename: f.filename, mimeType: mime, text: '', error: e?.message || 'Failed to parse' })
    }
  }
  return results
}
