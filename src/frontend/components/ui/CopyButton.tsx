"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const { toast } = useToast()

  const onCopy = async () => {
    // Try modern clipboard API first (requires secure context)
    try {
      await navigator.clipboard.writeText(text)
      toast({ title: 'Copied', description: 'Improved text copied to clipboard.' })
      return
    } catch {
      // ignore and fall back
    }

    // Fallback for environments where clipboard API is not available or blocked
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      // keep off-screen
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
      toast({ title: 'Copied', description: 'Improved text copied to clipboard.' })
    } catch {
      toast({ title: 'Copy failed', description: 'Please copy manually from the report.', variant: 'destructive' })
    }
  }
  return (
    <Button onClick={onCopy} type="button">
      {label}
    </Button>
  )
}
