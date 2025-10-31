"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Testimonials() {
  const testimonials = [
    {
      quote: "FairAssess helped us make our hiring language 40% more inclusive. The insights were eye-opening.",
      author: "Sarah Chen",
      role: "Head of Talent",
      company: "TechCorp",
      initials: "SC",
      rating: 5,
    },
    {
      quote: "We reduced hiring bias significantly and improved our diversity metrics within 3 months.",
      author: "Marcus Johnson",
      role: "HR Director",
      company: "Global Solutions Inc",
      initials: "MJ",
      rating: 5,
    },
    {
      quote: "The fairness scoring is transparent and actionable. Our team loves the AI-generated suggestions.",
      author: "Elena Rodriguez",
      role: "Recruiting Manager",
      company: "Innovation Labs",
      initials: "ER",
      rating: 5,
    },
    {
      quote: "Implementing FairAssess was a game-changer for our DEI initiatives. Highly recommended!",
      author: "David Park",
      role: "VP of People Operations",
      company: "Future Ventures",
      initials: "DP",
      rating: 5,
    },
  ]

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[...Array(rating)].map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  )

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Trusted by Leading Companies</h2>
          <p className="text-lg text-muted-foreground">See how FairAssess is transforming hiring practices</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="flex flex-col gap-4 h-full">
                {/* Star Rating */}
                {renderStars(testimonial.rating)}

                {/* Quote */}
                <p className="text-foreground italic leading-relaxed flex-1">"{testimonial.quote}"</p>

                {/* Author with Avatar */}
                <div className="pt-4 border-t border-border flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-primary mb-2">500+</p>
            <p className="text-muted-foreground">Companies using FairAssess</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary mb-2">40%</p>
            <p className="text-muted-foreground">Average improvement in fairness</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary mb-2">98%</p>
            <p className="text-muted-foreground">Customer satisfaction rate</p>
          </div>
        </div>
      </div>
    </section>
  )
}
