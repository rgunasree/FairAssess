"use client"

import React from 'react'
import CopyButton from '@/components/ui/CopyButton'
import { useI18n } from '@/components/i18n/LocaleProvider'
import { Button } from '@/components/ui/button'

export default function AnalysisActions({
  result,
}: {
  result: {
    originalText: string
    improvedText?: string
    fairnessScore?: number
    biasTypes?: any[]
    title?: string
    language?: string
    confidence?: number
    processingTime?: string
  }
}) {
  const { t } = useI18n()

  const download = async (type: 'pdf' | 'csv') => {
    const endpoint = type === 'pdf' ? '/api/export/pdf' : '/api/export/csv'
    const body = type === 'pdf' ? result : { results: [result] }
    const res = await fetch(endpoint, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = type === 'pdf' ? 'fairassess-report.pdf' : 'fairassess-report.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {result.improvedText && (
        <CopyButton text={result.improvedText} label={t('actions.copy')} />
      )}
      <Button onClick={() => download('pdf')} variant="default">
        {t('actions.downloadPdf')}
      </Button>
      <Button onClick={() => download('csv')} variant="outline">
        {t('actions.downloadCsv')}
      </Button>
    </div>
  )
}
