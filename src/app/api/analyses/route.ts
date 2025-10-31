import { NextResponse } from "next/server"
import { readAnalyses } from "@/services/storage"

export const runtime = "nodejs"

function statusFor(score: number) {
  if (score >= 80) return "Excellent"
  if (score >= 70) return "Good"
  if (score >= 60) return "Fair"
  return "Needs Improvement"
}

const colorMap: Record<string, string> = {
  "Gender Bias": "#3b82f6",
  "Age Bias": "#8b5cf6",
  "Cultural Bias": "#ec4899",
  "Racial Bias": "#22c55e",
  "Religious Bias": "#f97316",
  "Ableist Language": "#ef4444",
  "LGBTQ+ Bias": "#06b6d4",
  "Socioeconomic Bias": "#f59e0b",
}

// Helper to build response from a list of analyses
function buildResponse(list: any) {
  const totalAnalyses = list.length
  const avgFairness = totalAnalyses
    ? Math.round(list.reduce((s: number, a: any) => s + (a.fairnessScore || 0), 0) / totalAnalyses)
    : 0
  const issuesFound = list.reduce((s: number, a: any) => s + (a.biasTypes?.length || 0), 0)
  const contentImproved = list.reduce((s: number, a: any) => s + (a.improvedText && a.improvedText !== a.originalText ? 1 : 0), 0)

  // Historical last 6
  const last = list.slice(-6)
  const historicalScores = last.map((a: any) => ({
    date: new Date(a.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    score: a.fairnessScore,
  }))

  // Bias distribution by category
  const categoryCounts = new Map<string, number>()
  for (const a of list) {
    for (const b of a.biasTypes || []) {
      categoryCounts.set(b.type, (categoryCounts.get(b.type) || 0) + (b.examples?.length || 1))
    }
  }
  const totalBias = Array.from(categoryCounts.values()).reduce((s, v) => s + v, 0)
  const biasDistribution = totalBias
    ? Array.from(categoryCounts.entries()).map(([name, count]) => ({
        name,
        value: Math.round((count / totalBias) * 100),
        color: colorMap[name] || "#999999",
      }))
    : [
        { name: "Gender Bias", value: 0, color: colorMap["Gender Bias"] },
        { name: "Age Bias", value: 0, color: colorMap["Age Bias"] },
        { name: "Cultural Bias", value: 0, color: colorMap["Cultural Bias"] },
      ]

  // Recent analyses (last 4)
  const recentAnalyses = list.slice(-4).reverse().map((a: any) => ({
    id: a.id,
    title: a.title || a.originalText.slice(0, 40),
    date: new Date(a.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
    score: a.fairnessScore,
    status: statusFor(a.fairnessScore),
  }))

  // Recommendations: top 3 categories with a common suggestion
  const topCats = Array.from(categoryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat)

  const sampleIssue = (cat: string) =>
    ({
      "Gender Bias": "Use of gendered language in job descriptions",
      "Age Bias": "References to age-coded terms",
      "Cultural Bias": "Language excluding non-native speakers",
      "Racial Bias": "Subjective wording that may imply appearance",
      "Religious Bias": "Preference for specific belief systems",
      "Ableist Language": "Insensitive descriptors about mental/physical states",
      "LGBTQ+ Bias": "Assumptions about family structure or orientation",
      "Socioeconomic Bias": "Requirements implying wealth or ownership",
    } as Record<string, string>)[cat] || "Reduce subjective or exclusionary wording"

  const recommendations = topCats.map((cat) => ({
    category: cat,
    impact: categoryCounts.get(cat)! > 2 ? "High" : "Medium",
    issue: sampleIssue(cat),
    suggestion: "Use neutral, inclusive alternatives suggested by the analyzer",
  }))

  return {
    metrics: {
      averageFairness: avgFairness,
      totalAnalyses,
      biasIssuesFound: issuesFound,
      contentImproved,
    },
    historicalScores,
    biasDistribution,
    recentAnalyses,
    recommendations,
  }
}

export async function GET() {
  const list = (await readAnalyses()).sort((a, b) => a.date.localeCompare(b.date))
  return NextResponse.json(buildResponse(list))
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const biasTypes: string[] | undefined = body?.biasTypes
  const all = (await readAnalyses()).sort((a, b) => a.date.localeCompare(b.date))
  const list = biasTypes && biasTypes.length
    ? all.filter((a) => (a.biasTypes || []).some((b: any) => biasTypes.includes(b.type)))
    : all

  return NextResponse.json(buildResponse(list))
}