import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// We try to use the existing analysisService if present, otherwise fallback to a no-op analyzer
async function analyze(text: string, title?: string, language?: string): Promise<any> {
  try {
    // @ts-ignore - optional dependency within this repo
    const mod: any = await import('@/services/analysisService')
    // prefer `analyze` method if present, fall back to analyzeText
    if (typeof mod.analyze === 'function') {
      return await mod.analyze(text)
    }
    if (typeof mod.analyzeText === 'function') {
      return await mod.analyzeText({ text, title, language })
    }
  } catch {
    void 0
  }
  // Fallback minimal result
  return {
    title,
    originalText: text,
    improvedText: text,
    fairnessScore: 100,
    biasTypes: [],
    confidence: 1,
    processingTime: '0ms',
    language: language || 'en',
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const lang = body.lang || body.language

    let items: Array<{ text: string; title?: string }> = []
    if (Array.isArray(body.items)) items = body.items
    else if (Array.isArray(body.texts)) items = body.texts.map((t: string) => ({ text: t }))
    else if (typeof body.text === 'string') items = [{ text: body.text, title: body.title }]

    if (!items.length) return NextResponse.json({ error: 'Provide items/texts/text' }, { status: 400 })

    const results = [] as any[]
    for (const it of items) {
      const res = await analyze(it.text, it.title, lang)
      results.push(res)
    }
    return NextResponse.json({ results, count: results.length })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Batch analysis failed' }, { status: 400 })
  }
}
