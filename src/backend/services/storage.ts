import fs from "fs/promises"
import path from "path"
import { type BiasFinding } from "@/lib/nlp/analyzer"

export type SavedAnalysis = {
  id: string
  title?: string
  date: string // ISO
  originalText: string
  fairnessScore: number
  biasTypes: BiasFinding[]
  improvedText: string
}

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_PATH = path.join(DATA_DIR, "analyses.json")

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.access(DATA_PATH).catch(async () => {
      await fs.writeFile(DATA_PATH, "[]", "utf-8")
    })
  } catch {
    // ignore ensure data file errors
    return
  }
}

export async function readAnalyses(): Promise<SavedAnalysis[]> {
  try {
    await ensureDataFile()
    const raw = await fs.readFile(DATA_PATH, "utf-8")
    const data = JSON.parse(raw) as SavedAnalysis[]
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function appendAnalysis(item: SavedAnalysis): Promise<void> {
  await ensureDataFile()
  const list = await readAnalyses()
  list.push(item)
  await fs.writeFile(DATA_PATH, JSON.stringify(list, null, 2), "utf-8")
}