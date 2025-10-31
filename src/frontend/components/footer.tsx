"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-foreground font-bold text-sm">FA</span>
              </div>
              <span className="font-bold text-lg">FairAssess</span>
            </div>
            <p className="text-sm opacity-80">Because fairness isn't optional. It's measurable.</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/analyze" className="hover:opacity-100 transition-opacity">
                  Analyze
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:opacity-100 transition-opacity">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:opacity-100 transition-opacity">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/" className="hover:opacity-100 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="hover:opacity-100 transition-opacity">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:opacity-100 transition-opacity">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/privacy" className="hover:opacity-100 transition-opacity">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:opacity-100 transition-opacity">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-100 transition-opacity">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-80">
          <p>&copy; 2025 FairAssess. All rights reserved.</p>
          <p>Made with care by FairAssess</p>
        </div>
      </div>
    </footer>
  )
}
