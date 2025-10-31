"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Unlock Fairer Hiring.
                <span className="text-primary"> Eliminate Bias.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                AI-powered bias detection and equitable scoring for inclusive assessments. Transform your hiring process
                with data-driven fairness.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/analyze">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  Analyze 
                </Button>
              </Link>
              <Link href="/#pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Buy Now
                </Button>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="pt-4 text-sm text-muted-foreground">
              ✓ Used by 500+ companies • ✓ GDPR Compliant • ✓ Real-time Analysis
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="relative h-96 md:h-full flex items-center justify-center">
            <div className="relative w-full h-full max-w-md">
              {/* Decorative gradient circles */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"></div>

              {/* Justice Scale Illustration */}
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full relative z-10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Scale base */}
                <rect x="70" y="140" width="60" height="8" fill="currentColor" className="text-primary" />

                {/* Scale pole */}
                <line
                  x1="100"
                  y1="140"
                  x2="100"
                  y2="60"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-primary"
                />

                {/* Left pan */}
                <rect
                  x="40"
                  y="50"
                  width="40"
                  height="30"
                  rx="4"
                  fill="currentColor"
                  className="text-primary"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                {/* Right pan */}
                <rect
                  x="120"
                  y="50"
                  width="40"
                  height="30"
                  rx="4"
                  fill="currentColor"
                  className="text-accent"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                {/* Left weight (bias) */}
                <circle cx="60" cy="35" r="8" fill="currentColor" className="text-destructive" />

                {/* Right weight (fairness) */}
                <circle cx="140" cy="35" r="8" fill="currentColor" className="text-primary" />

                {/* Decorative elements */}
                <circle cx="30" cy="100" r="3" fill="currentColor" className="text-primary/40" />
                <circle cx="170" cy="100" r="3" fill="currentColor" className="text-primary/40" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
