import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LocaleProvider } from "@/components/i18n/LocaleProvider"
import LanguageSwitcher from "@/components/ui/LanguageSwitcher"

const _geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FairAssess - Bias Detection for Fair Hiring",
  description:
    "AI-powered bias detection and equitable scoring for inclusive assessments. Eliminate bias from your hiring process.",
  generator: "v0.app",
  metadataBase: new URL("https://www.fairassess.example"),
  icons: {
    icon: "/placeholder-logo.svg",
    shortcut: "/placeholder-logo.svg",
    apple: "/placeholder-logo.png",
  },
  openGraph: {
    title: "FairAssess - Bias Detection for Fair Hiring",
    description:
      "AI-powered bias detection and equitable scoring for inclusive assessments. Eliminate bias from your hiring process.",
    url: "/",
    siteName: "FairAssess",
    images: [
      { url: "/placeholder.jpg", width: 1200, height: 630, alt: "FairAssess" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FairAssess - Bias Detection for Fair Hiring",
    description:
      "AI-powered bias detection and equitable scoring for inclusive assessments.",
    images: ["/placeholder.jpg"],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#335cff" },
    { media: "(prefers-color-scheme: dark)", color: "#6f8cff" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${_geist.className} antialiased bg-background text-foreground selection:bg-primary/20 selection:text-primary`}
      >
        <LocaleProvider>
          <div className="relative min-h-screen">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60rem_60rem_at_120%_-10%,theme(colors.primary/10),transparent_60%)]" />
            <div className="fixed right-4 top-4 z-20"><LanguageSwitcher /></div>
            {children}
            <Analytics />
          </div>
        </LocaleProvider>
      </body>
    </html>
  )
}
