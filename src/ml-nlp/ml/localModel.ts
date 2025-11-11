// Lightweight local classifier runtime
// Model artifact format: { labels: string[], vocab: string[], weights: number[][], bias: number[] }
// Prediction: sigmoid(Wx + b) per label (multi-label)

export type LocalModelArtifact = {
  labels: string[]
  vocab: string[]
  weights: number[][] // shape: labels x vocabSize
  bias: number[] // shape: labels
}

export type LocalModel = {
  labels: string[]
  predict: (tokens: string[]) => { labels: string[]; scores: number[] }
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

export async function loadLocalModel(url: string): Promise<LocalModel | null> {
  try {
    // Support both browser fetch (client) and filesystem reads (server/runtime)
    let art: LocalModelArtifact
    if (typeof window === "undefined" && url.startsWith("/")) {
      // Running on the server — read the model from the project's public/ folder
      const fs = await import("fs/promises")
      const path = await import("path")
      const filePath = path.join(process.cwd(), "public", url.replace(/^\//, ""))
      const raw = await fs.readFile(filePath, "utf8")
      art = JSON.parse(raw) as LocalModelArtifact
    } else {
      const res = await fetch(url)
      if (!res.ok) return null
      art = (await res.json()) as LocalModelArtifact
    }
    const labelCount = art.labels.length
    const vocabIndex = new Map(art.vocab.map((t, i) => [t, i]))

    return {
      labels: art.labels,
      predict: (tokens: string[]) => {
        const vec = new Array(art.vocab.length).fill(0)
        for (const t of tokens) {
          const idx = vocabIndex.get(t)
          if (idx !== undefined) vec[idx] += 1
        }
        const scores: number[] = []
        for (let i = 0; i < labelCount; i++) {
          let z = art.bias[i] || 0
          const w = art.weights[i]
          for (let j = 0; j < w.length; j++) z += w[j] * vec[j]
          scores.push(sigmoid(z))
        }
        return { labels: art.labels, scores }
      },
    }
  } catch {
    return null
  }
}
