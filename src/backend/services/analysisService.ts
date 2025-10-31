import { analyzeTextLocal, type AnalysisResult } from "@/lib/nlp/analyzer"
import { preprocess } from "@/lib/nlp/preprocess"
import { zeroShotClassify } from "@/lib/ml/hf"
import { loadLocalModel } from "@/lib/ml/localModel"

export type FullAnalysis = AnalysisResult & {
  model?: { provider: string; labels: string[]; scores: number[] }
  tokens?: string[]
}

const MODEL_URL = "/models/bias-classifier.json"

export async function analyze(text: string): Promise<FullAnalysis> {
  const prep = preprocess(text)

  const base = analyzeTextLocal(prep.text)

  // Try local model first for quick scores
  let provider = "local"
  let labels: string[] = []
  let scores: number[] = []

  const localModel = await loadLocalModel(MODEL_URL)
  if (localModel) {
    const res = localModel.predict(prep.tokens)
    labels = res.labels
    scores = res.scores
  } else {
    // fallback: try HF if token exists
    provider = "huggingface"
    const fallbackLabels = [
      "Gender Bias",
      "Age Bias",
      "Cultural Bias",
      "Racial Bias",
      "Religious Bias",
      "Ableist Language",
      "LGBTQ+ Bias",
      "Socioeconomic Bias",
    ]
    const zs = await zeroShotClassify(prep.text, fallbackLabels).catch(() => null)
    if (zs) {
      labels = zs.labels
      scores = zs.scores
    } else {
      provider = "none"
    }
  }

  // Calibrate local findings using model scores
  if (labels.length && scores.length) {
    base.biasTypes = base.biasTypes.map((b) => {
      const idx = labels.findIndex((l) => l.toLowerCase() === b.type.toLowerCase())
      if (idx >= 0) {
        const mlScore = scores[idx]
        return { ...b, confidence: Math.max(b.confidence, Math.min(1, mlScore)) }
      }
      return b
    })
  }

  return { ...base, model: provider === "none" ? undefined : { provider, labels, scores }, tokens: prep.tokens }
}
