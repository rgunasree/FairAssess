"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PricingSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      description: "Perfect for small teams",
      features: ["Up to 100 analyses/month", "Basic bias detection", "Email support", "PDF reports"],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Professional",
      price: "$12",
      period: "/month",
      description: "For growing companies",
      features: [
        "Unlimited analyses",
        "Advanced bias detection",
        "Priority support",
        "API access",
        "Team collaboration",
        "Custom integrations",

      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom training",
        "SLA guarantee",
        "On-premise deployment",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 md:py-32 bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground">Choose the plan that fits your organization</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" ref={ref}>
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card
                className={`group p-8 border transition-all duration-500 ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-primary/10 to-secondary/10 border-primary shadow-lg scale-105"
                    : "bg-card border-border hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5"
                } hover:shadow-xl hover:scale-[1.02]`}
              >
                <div className="space-y-6">
                  {plan.highlighted && (
                    <motion.div 
                      className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      Most Popular
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  </motion.div>

                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </motion.div>

                  <Link
                    href={plan.name === "Enterprise" ? "/contact" : "/analyze"}
                    className="block"
                  >
                    <Button
                      className={`w-full transition-all duration-300 ${plan.highlighted ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  <div className="space-y-3 pt-4 border-t border-border">
                    {plan.features.map((feature, i) => (
                      <motion.div 
                        key={i} 
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: i * 0.1 + 0.5 }}
                      >
                        <span className="text-primary mt-1 group-hover:animate-bounce">✓</span>
                        <span className="text-sm text-foreground">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-muted-foreground mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/pricing">
              <Button 
                variant="outline" 
                className="bg-transparent backdrop-blur-sm border-primary/20 hover:border-primary/50 hover:bg-primary/5"
              >
                View Detailed Comparison
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
