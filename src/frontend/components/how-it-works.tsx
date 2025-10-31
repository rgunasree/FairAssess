"use client"

import { Card } from "@/components/ui/card"

import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const steps = [
    {
      number: "1",
      title: "Detect Bias",
      description: "Identify gender, cultural, and linguistic bias instantly with our advanced NLP engine.",
      gradient: "from-blue-500/20 to-purple-500/20",
      glowColor: "group-hover:shadow-blue-500/25",
    },
    {
      number: "2",
      title: "Get Insights",
      description: "View highlighted text and comprehensive fairness scoring with detailed breakdowns.",
      gradient: "from-green-500/20 to-emerald-500/20",
      glowColor: "group-hover:shadow-green-500/25",
    },
    {
      number: "3",
      title: "Rewrite & Normalize",
      description: "AI-generated inclusive alternatives and fair scoring normalization for equitable assessments.",
      gradient: "from-purple-500/20 to-pink-500/20",
      glowColor: "group-hover:shadow-purple-500/25",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your hiring process into a fair and inclusive experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" ref={ref}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card 
                className={`group p-8 bg-gradient-to-br ${step.gradient} backdrop-blur-sm 
                  border border-border hover:border-primary/50 transition-all duration-500
                  hover:scale-105 hover:shadow-xl ${step.glowColor}`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                    </motion.div>
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm"
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {step.number}
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Process Flow Visualization */}
        <motion.div 
          className="mt-16 p-8 bg-gradient-to-r from-secondary/30 via-primary/10 to-secondary/30 rounded-lg border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left relative">
            {[
              { title: "INPUT", desc: "Paste or upload your content" },
              { title: "ANALYSIS", desc: "AI detects bias patterns" },
              { title: "INSIGHTS", desc: "Get fairness score & suggestions" },
              { title: "IMPROVE", desc: "Use AI rewrites for fairness" }
            ].map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <motion.div
                  className="flex-1 group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <p className="text-sm font-semibold text-primary mb-2 transition-colors group-hover:text-primary/80">
                    {step.title}
                  </p>
                  <p className="text-foreground transition-colors group-hover:text-primary/90">{step.desc}</p>
                </motion.div>
                {index < 3 && (
                  <motion.div 
                    className="hidden md:flex items-center justify-center w-12 h-12 mx-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { 
                      opacity: 1, 
                      x: 0,
                    } : { opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.2 + 0.8 }}
                  >
                    <motion.div
                      className="w-8 h-[2px] bg-primary rounded-full origin-right"
                      animate={{ scaleX: [0, 1], opacity: [0.5, 1] }}
                      transition={{
                        duration: 1,
                        delay: index * 0.3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="w-3 h-[2px] bg-primary rounded-full absolute transform rotate-45 origin-left"
                      animate={{ scaleX: [0, 1], opacity: [0.5, 1] }}
                      transition={{
                        duration: 1,
                        delay: index * 0.3 + 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                      style={{ right: "0.5rem", top: "calc(50% - 2px)" }}
                    />
                    <motion.div
                      className="w-3 h-[2px] bg-primary rounded-full absolute transform -rotate-45 origin-left"
                      animate={{ scaleX: [0, 1], opacity: [0.5, 1] }}
                      transition={{
                        duration: 1,
                        delay: index * 0.3 + 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                      style={{ right: "0.5rem", bottom: "calc(50% - 2px)" }}
                    />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          <motion.div 
            className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5"
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}
