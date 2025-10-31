import { NextResponse } from 'next/server'
import { buildPDFBuffer } from '@/services/exportPdf'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const result = await req.json()
    const pdf = await buildPDFBuffer(result)
    const ab = pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength) as ArrayBuffer
    return new Response(new Blob([ab]), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="fairassess-report.pdf"'
      }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'PDF export failed' }, { status: 400 })
  }
}
