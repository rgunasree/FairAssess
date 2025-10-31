"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type AnalysisInputProps = {
  value: string
  onChange: (val: string) => void
  onAnalyze: () => void
  isLoading: boolean
}

export default function AnalysisInput({ value, onChange, onAnalyze, isLoading }: AnalysisInputProps) {
  const [fileError, setFileError] = useState("")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    const validTypes = [
      "text/plain",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!validTypes.includes(file.type)) {
      setFileError("Please upload a TXT, PDF, or DOCX file")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size must be less than 5MB")
      return
    }

    setFileError("")

    // For demo, just read text files
    if (file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result
        onChange(typeof result === "string" ? result : "")
      }
      reader.readAsText(file)
    } else {
      setFileError("For demo, please use TXT files. PDF and DOCX support coming soon.")
    }
  }

  return (
    <Card className="p-8 bg-card border border-border">
      <div className="space-y-6">
        {/* Textarea */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">Paste or type your content</label>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste your job description, interview script, survey question, or any hiring content here..."
            className="w-full h-64 p-4 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">{value.length} characters</p>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">Or upload a file</label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <input
              type="file"
              accept=".txt,.pdf,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">TXT, PDF, or DOCX (max 5MB)</p>
            </label>
          </div>
          {fileError && <p className="text-sm text-destructive mt-2">{fileError}</p>}
        </div>

        {/* Analyze Button */}
        <Button
          onClick={onAnalyze}
          disabled={!value.trim() || isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
          size="lg"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
              Analyzing...
            </span>
          ) : (
            "Analyze for Bias"
          )}
        </Button>

        {/* Info */}
        <div className="bg-secondary/30 border border-border rounded-lg p-4">
          <p className="text-sm text-foreground">
            <span className="font-semibold">How it works:</span> Our NLP engine analyzes your content for gender,
            cultural, age, and linguistic bias patterns. Results are instant and actionable.
          </p>
        </div>
      </div>
    </Card>
  )
}
