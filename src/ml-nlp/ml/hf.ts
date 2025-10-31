const HF_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli"

export type ZeroShotResult = {
  labels: string[]
  scores: number[]
}

export async function zeroShotClassify(
  text: string,
  labels: string[],
  multiLabel = true
): Promise<ZeroShotResult | null> {
  const token = process.env.HF_API_TOKEN
  if (!token) return null

  const res = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: text,
      parameters: { candidate_labels: labels, multi_label: multiLabel },
    }),
  })

  if (!res.ok) return null
  const data = (await res.json()) as { labels: string[]; scores: number[] }
  return { labels: data.labels, scores: data.scores }
}
