"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import en from './messages/en.json'
import es from './messages/es.json'
import fr from './messages/fr.json'
import de from './messages/de.json'

export type Locale = 'en' | 'es' | 'fr' | 'de'

type Dictionary = Record<string, string>

const DICTS: Record<Locale, Dictionary> = { en, es, fr, de }

interface I18nContextValue {
  locale: Locale
  t: (key: string) => string
  setLocale: (l: Locale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && window.localStorage.getItem('locale')) as Locale | null
    if (stored && DICTS[stored]) setLocale(stored)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem('locale', locale)
  }, [locale])

  const dict = useMemo(() => DICTS[locale], [locale])

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    setLocale,
    t: (key: string) => dict[key] ?? key,
  }), [locale, dict])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within LocaleProvider')
  return ctx
}
