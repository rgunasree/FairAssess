"use client"
import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import HowItWorks from "@/components/how-it-works"
import PricingSection from "@/components/pricing-section"
import Testimonials from "@/components/testimonials"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <HowItWorks />
      <PricingSection />
      <Testimonials />
      <Footer />
    </div>
  )
}
