"use client"

import React from 'react'
import { Button } from '@/components/ui/button'

export default function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      void 0
    }
  }
  return (
    <Button onClick={onCopy} type="button">
      {label}
    </Button>
  )
}
