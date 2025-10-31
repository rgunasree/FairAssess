import { NextResponse } from "next/server"
import { readAnalyses } from "@/services/storage"

export const runtime = "nodejs"

export async function GET(_req: Request, ctx: any) {
  // Next.js may provide `params` as a promise; await it to be safe
  const params = await ctx.params
  const { id } = params as { id: string }
  const list = await readAnalyses()
  const found = list.find((a) => a.id === id)
  if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(found)
}
