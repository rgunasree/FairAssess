"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import AnalysisInput from "@/components/analysis-input"
import ExampleCards from "@/components/example-cards"
import AnalysisResults from "@/components/analysis-results"
import Footer from "@/components/footer"
import UploadProcessor from "@/components/main/UploadProcessor"
import type { AnalysisResult } from "@/lib/nlp/analyzer"

export default function AnalyzePage() {
  const [analysisText, setAnalysisText] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!analysisText.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: analysisText,
          title: `Analysis - ${analysisText.slice(0, 32)}`,
        }),
      })
      if (!res.ok) throw new Error("Failed to analyze")
      const data = await res.json()
      setAnalysisData(data)
      setShowResults(true)
    } catch (err) {
      console.error(err)
      // fallback minimal client-side analysis (very basic)
      const basic = {
        originalText: analysisText,
        fairnessScore: 70,
        biasTypes: [],
        improvedText: analysisText,
      }
      setAnalysisData(basic)
      setShowResults(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleSelect = (exampleText: string) => {
    setAnalysisText(exampleText)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {!showResults ? (
        <>
          <section className="py-12 md:py-20 bg-gradient-to-br from-background via-background to-secondary/20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Analyze Your Content for Bias</h1>
                <p className="text-lg text-muted-foreground">
                  Our NLP engine identifies hidden bias in wording and suggests fair alternatives.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Input Area */}
                <div className="lg:col-span-2 space-y-8">
                  <AnalysisInput
                    value={analysisText}
                    onChange={setAnalysisText}
                    onAnalyze={handleAnalyze}
                    isLoading={isLoading}
                  />
                  {/* Document Upload + Batch Processing */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Upload Documents (PDF/DOCX) & Batch Process</h3>
                    <UploadProcessor />
                  </div>
                </div>

                {/* Example Cards */}
                <div>
                  <ExampleCards onSelectExample={handleExampleSelect} />
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        analysisData && (
          <AnalysisResults
            data={analysisData}
            onBack={() => {
              setShowResults(false)
              setAnalysisText("")
              setAnalysisData(null)
            }}
          />
        )
      )}

      <Footer />
    </div>
  )
}
