"use client"

import React from 'react'
import { useI18n, Locale } from '@/components/i18n/LocaleProvider'

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()
  const options: { code: Locale; label: string }[] = [
    { code: 'en', label: t('lang.english') },
    { code: 'es', label: t('lang.spanish') },
    { code: 'fr', label: t('lang.french') },
    { code: 'de', label: t('lang.german') },
  ]

  return (
    <select
      aria-label="Language"
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      style={{ border: '1px solid #ccc', padding: 4, borderRadius: 6 }}
    >
      {options.map((o) => (
        <option key={o.code} value={o.code}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
