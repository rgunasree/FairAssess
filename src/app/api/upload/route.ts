import { NextResponse } from 'next/server'
import { extractMany } from '@/services/document'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const entries = form.getAll('files') as unknown as File[]
    const one = form.get('file') as unknown as File | null
    const files: File[] = []
    if (entries && entries.length) files.push(...entries)
    if (one) files.push(one)
    if (!files.length) {
      return NextResponse.json({ error: 'No files uploaded. Use field name "file" or "files".' }, { status: 400 })
    }

    const prepared = await Promise.all(
      files.map(async (f) => ({ filename: f.name, mimeType: f.type, buffer: Buffer.from(await f.arrayBuffer()) }))
    )

    const extracted = await extractMany(prepared)
    return NextResponse.json({ documents: extracted })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 400 })
  }
}
