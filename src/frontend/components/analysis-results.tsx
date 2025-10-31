"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { AnalysisResult } from "@/lib/nlp/analyzer"
import AnalysisActions from "@/components/main/AnalysisActions"

type AnalysisResultsProps = {
  data: AnalysisResult
  onBack: () => void
}

export default function AnalysisResults({ data, onBack }: AnalysisResultsProps) {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button onClick={onBack} variant="outline" className="mb-6 bg-transparent">
            ← Back to Analysis
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Bias Analysis Report</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Pane - Original Text */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-card border border-border h-full">
              <h3 className="font-semibold text-foreground mb-4">Your Content</h3>
              <div className="bg-input p-4 rounded-lg text-sm text-foreground leading-relaxed max-h-96 overflow-y-auto">
                {data.originalText.split(" ").map((word: string, idx: number) => {
                  const isBiased = data.biasTypes.some((bt) =>
                    bt.examples.some((ex) => ex.toLowerCase() === word.toLowerCase()),
                  )
                  return (
                    <span
                      key={idx}
                      className={isBiased ? "bg-destructive/20 text-destructive font-semibold px-1 rounded" : ""}
                    >
                      {word}{" "}
                    </span>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Center - Fairness Score */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-card border border-border flex flex-col items-center justify-center h-full">
              <h3 className="font-semibold text-foreground mb-6 text-center">Fairness Score</h3>

              {/* Circular Gauge */}
              <div className="relative w-40 h-40 mb-6">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-border"
                  />

                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${(data.fairnessScore / 100) * 283} 283`}
                    strokeLinecap="round"
                    className="text-primary transition-all"
                    style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                  />

                  {/* Center text */}
                  <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-2xl font-bold fill-foreground">
                    {data.fairnessScore}%
                  </text>
                </svg>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {data.fairnessScore >= 80
                  ? "Excellent fairness level"
                  : data.fairnessScore >= 60
                    ? "Good, but room for improvement"
                    : "Significant bias detected"}
              </p>
            </Card>
          </div>

          {/* Right Pane - Bias Breakdown */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Bias Breakdown</h3>
              {data.biasTypes.map((bias, idx) => (
                <Card key={idx} className="p-4 bg-card border border-border">
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{bias.type}</p>
                      <p className="text-xs text-muted-foreground">Confidence: {(bias.confidence * 100).toFixed(0)}%</p>
                    </div>

                    {/* Confidence bar */}
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${bias.confidence * 100}%` }}
                      ></div>
                    </div>

                    {/* Examples and suggestions */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="font-semibold text-destructive mb-1">Biased words:</p>
                        <div className="flex flex-wrap gap-1">
                          {bias.examples.map((ex, i) => (
                            <span key={i} className="bg-destructive/10 text-destructive px-2 py-1 rounded">
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-primary mb-1">Suggestions:</p>
                        <div className="flex flex-wrap gap-1">
                          {bias.suggestions.map((sug, i) => (
                            <span key={i} className="bg-primary/10 text-primary px-2 py-1 rounded">
                              {sug}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Improved Text Section */}
        <Card className="mt-8 p-8 bg-card border border-border">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Improved Content</h3>
            <p className="text-sm text-muted-foreground">
              Here's your content rewritten with bias-aware language for more inclusive and fair assessments.
            </p>

            <div className="bg-input p-6 rounded-lg text-foreground leading-relaxed">{data.improvedText}</div>

            <div className="flex flex-col sm:flex-row gap-4">
              <AnalysisActions
                result={{
                  originalText: data.originalText,
                  improvedText: data.improvedText,
                  fairnessScore: data.fairnessScore,
                  biasTypes: data.biasTypes as any,
                  title: 'Analysis Report',
                }}
              />
            </div>
          </div>
        </Card>

        {/* Equitable Scoring Info */}
        <Card className="mt-8 p-8 bg-secondary/30 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Equitable Scoring Normalization</h3>
          <p className="text-foreground leading-relaxed">
            Our fairness algorithm normalizes scoring by removing subjective language that may disadvantage certain
            groups. By identifying and replacing biased terminology with neutral alternatives, we help ensure that all
            candidates are evaluated on merit and capability rather than demographic assumptions. This approach has been
            shown to increase diversity in hiring outcomes while maintaining assessment validity.
          </p>
        </Card>
      </div>
    </section>
  )
}
