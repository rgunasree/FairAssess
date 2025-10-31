import { NextRequest, NextResponse } from "next/server"
import { analyze } from "@/services/analysisService"
import { appendAnalysis, type SavedAnalysis } from "@/services/storage"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const { text, title } = (await req.json()) as { text?: string; title?: string }
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Missing 'text'" }, { status: 400 })
    }

    const result = await analyze(text)

    // Persist a summarized record for the dashboard
    try {
      const record: SavedAnalysis = {
        id: (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)),
        title: title || text.slice(0, 60),
        date: new Date().toISOString(),
        originalText: text,
        fairnessScore: result.fairnessScore,
        biasTypes: result.biasTypes,
        improvedText: result.improvedText,
      }
      await appendAnalysis(record)
    } catch {
      // best-effort; ignore persistence errors
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
