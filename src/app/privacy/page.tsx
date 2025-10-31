import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
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

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">Privacy Policy</h1>

          <Card className="p-8 bg-card border border-border space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
              <p className="text-foreground leading-relaxed">
                FairAssess ("we", "us", "our") operates the FairAssess website and service. This page informs you of our
                policies regarding the collection, use, and disclosure of personal data when you use our service and the
                choices you have associated with that data.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Information Collection and Use</h2>
              <p className="text-foreground leading-relaxed mb-4">
                We collect several different types of information for various purposes to provide and improve our
                service to you.
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground">
                <li>Personal Data: Name, email address, phone number, cookies and usage data</li>
                <li>Usage Data: Information about how you use our service</li>
                <li>Analysis Content: Text you submit for bias analysis</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Security of Data</h2>
              <p className="text-foreground leading-relaxed">
                The security of your data is important to us but remember that no method of transmission over the
                Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable
                means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
              <p className="text-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at privacy@fairassess.com
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
