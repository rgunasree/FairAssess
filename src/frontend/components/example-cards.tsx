"use client"

import { Card } from "@/components/ui/card"

type ExampleCardsProps = {
  onSelectExample: (text: string) => void
}

export default function ExampleCards({ onSelectExample }: ExampleCardsProps) {
  const examples = [
    {
      title: "Job Description",
      icon: "📋",
      text:
        "We are looking for an aggressive and dynamic software engineer with 5+ years of experience. Must be a digital native and energetic team player. Ideal candidate should be ambitious and willing to work long hours.",
    },
    {
      title: "Interview Script",
      icon: "🎤",
      text:
        "Tell us about a time you were aggressive in pursuing a goal. How do you stay energetic during long projects? We value ambitious individuals who can adapt quickly.",
    },
    {
      title: "Survey Question",
      icon: "📝",
      text:
        "Rate your agreement: I am an ambitious professional. I consider myself energetic and dynamic. I prefer working with native English speakers.",
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Try an example</h3>
      {examples.map((example, index) => (
        <Card
          key={index}
          onClick={() => onSelectExample(example.text)}
          className="p-4 bg-card border border-border hover:border-primary/50 cursor-pointer transition-all hover:shadow-md"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{example.icon}</span>
              <h4 className="font-semibold text-foreground text-sm">{example.title}</h4>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{example.text}</p>
            <p className="text-xs text-primary font-semibold">Click to load</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
