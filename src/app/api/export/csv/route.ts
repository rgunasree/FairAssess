import { NextResponse } from 'next/server'
import { buildCSV } from '@/services/exportCsv'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const csv = buildCSV(body.results || body)
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="fairassess-report.csv"'
      }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'CSV export failed' }, { status: 400 })
  }
}
