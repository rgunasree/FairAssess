import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-12 md:py-20 bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="outline" className="mb-6 bg-transparent">
              ← Back to Home
            </Button>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">Terms of Service</h1>

          <Card className="p-8 bg-card border border-border space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Agreement to Terms</h2>
              <p className="text-foreground leading-relaxed">
                By accessing and using the FairAssess website and service, you accept and agree to be bound by the terms
                and provision of this agreement.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Use License</h2>
              <p className="text-foreground leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on
                FairAssess for personal, non-commercial transitory viewing only. This is the grant of a license, not a
                transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the site</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Disclaimer</h2>
              <p className="text-foreground leading-relaxed">
                The materials on FairAssess are provided on an 'as is' basis. FairAssess makes no warranties, expressed
                or implied, and hereby disclaims and negates all other warranties including, without limitation, implied
                warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
                intellectual property or other violation of rights.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Limitations</h2>
              <p className="text-foreground leading-relaxed">
                In no event shall FairAssess or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on FairAssess.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
