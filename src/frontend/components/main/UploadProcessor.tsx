"use client"

import React, { useState } from 'react'
import { useI18n } from '@/components/i18n/LocaleProvider'
import AnalysisActions from '@/components/main/AnalysisActions'
import { Button } from '@/components/ui/button'

interface Result {
  title?: string
  originalText: string
  improvedText?: string
  fairnessScore?: number
  biasTypes?: any[]
  language?: string
  confidence?: number
  processingTime?: string
}

export default function UploadProcessor() {
  const { t, locale } = useI18n()
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Result[]>([])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = Array.from(e.target.files || [])
    setFiles(f)
  }

  const process = async () => {
    try {
      setLoading(true)
      setResults([])
      const form = new FormData()
      files.forEach((f) => form.append('files', f))
      const upRes = await fetch('/api/upload', { method: 'POST', body: form })
      if (!upRes.ok) throw new Error('upload failed')
      const up = await upRes.json()
      const items = (up.documents || []).map((d: any) => ({ text: d.text, title: d.filename }))
      const anRes = await fetch('/api/analyze-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, language: locale }),
      })
      const an = await anRes.json()
      setResults(an.results || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.docx"
          multiple
          onChange={onFileChange}
        />
        <Button
          onClick={process}
          disabled={!files.length || loading}
        >
          {t('actions.processBatch')}
        </Button>
      </div>
      {loading && <div className="text-sm opacity-70">Processing...</div>}
      <div className="space-y-6">
        {results.map((r, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="mb-2 text-sm font-medium">{r.title || `Item ${i + 1}`}</div>
            <div className="text-sm mb-3 whitespace-pre-wrap opacity-80">{r.originalText?.slice(0, 400)}{r.originalText && r.originalText.length > 400 ? '…' : ''}</div>
            <AnalysisActions result={r} />
          </div>
        ))}
      </div>
    </div>
  )
}
