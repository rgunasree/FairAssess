export type PreprocessOutput = {
  text: string
  sentences: string[]
  tokens: string[]
}

const SENTENCE_SPLIT = /(?<=[.!?])\s+|(?<=\n)\s*/g
const TOKEN_SPLIT = /[^\p{L}\p{N}']+/u

export function preprocess(text: string): PreprocessOutput {
  const normalized = text.replace(/\r\n?/g, "\n").trim()
  const sentences = normalized.split(SENTENCE_SPLIT).filter(Boolean)
  const tokens = normalized
    .toLowerCase()
    .split(TOKEN_SPLIT)
    .filter(Boolean)
  return { text: normalized, sentences, tokens }
}
