"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

export default function ResultsDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    metrics: { averageFairness: number; totalAnalyses: number; biasIssuesFound: number; contentImproved: number }
    historicalScores: { date: string; score: number }[]
    biasDistribution: { name: string; value: number; color: string }[]
    recentAnalyses: { id: string; title: string; date: string; score: number; status: string }[]
    recommendations: { category: string; impact: string; issue: string; suggestion: string }[]
  } | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const [selected, setSelected] = useState<any | null>(null)
  const [selectedBiasTypes, setSelectedBiasTypes] = useState<string[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { toast } = useToast()

  // Helper to copy text with fallback (used by Apply Fix flows)
  async function copyWithFallback(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      toast({ title: 'Improved text copied!', description: 'You can now paste it into your editor.' })
      return true
    } catch {
      // fallback to textarea
      try {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
        toast({ title: 'Improved text copied!', description: 'You can now paste it into your editor.' })
        return true
      } catch {
        toast({ title: 'Failed to copy text', description: 'Please try again or copy manually from the report.', variant: 'destructive' })
        return false
      }
    }
  }

  async function openReport(id: string) {
    setReportOpen(true)
    try {
      const res = await fetch(`/api/analyses/${id}`, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        setSelected(json)
      }
    } catch {
      // ignore
    }
  }

  const applyFix = async (_?: React.MouseEvent<HTMLButtonElement>) => {
    let text: string | undefined = selected?.improvedText;
    
    // If no selected analysis text, try to get the first recent analysis
    if (!text && data?.recentAnalyses?.[0]?.id) {
      const id = data.recentAnalyses[0].id
      const res = await fetch(`/api/analyses/${id}`, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        text = json.improvedText
        setSelected(json)
      }
    }

    if (!text) {
      toast({ 
        title: 'No improved text available', 
        description: 'Open a report first to generate improvements.',
        variant: 'destructive'
      })
      return
    }

    await copyWithFallback(text)
  }

  const handleApplyFix = async (id: string) => {
    try {
      const res = await fetch(`/api/analyses/${id}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch analysis')
      const json = await res.json()
      if (!json.improvedText) throw new Error('No improved text available')
      
      await copyWithFallback(json.improvedText)
    } catch {
      toast({ 
        title: 'Failed to copy text', 
        description: 'Please try again or copy manually from the report.',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/analyses", { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            biasTypes: selectedBiasTypes.length ? selectedBiasTypes : undefined 
          })
        })
        const json = await res.json()
        setData(json)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [selectedBiasTypes, refreshTrigger])

  const getStatusColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 70) return "bg-blue-100 text-blue-800"
    if (score >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-12 md:py-20 bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <Link href="/analyze">
              <Button variant="outline" className="mb-6 bg-transparent">
                ← Back to Analysis
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Analysis Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Track your fairness improvements and monitor bias patterns across your hiring content.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {["Average Fairness Score", "Total Analyses", "Bias Issues Found", "Content Improved"].map((label, i) => (
              <Card key={i} className="p-6 bg-card border border-border">
                <p className="text-sm text-muted-foreground mb-2">{label}</p>
                {loading || !data ? (
                  <p className="text-3xl font-bold text-muted-foreground">—</p>
                ) : (
                  <>
                    {label === "Average Fairness Score" && (
                      <p className="text-3xl font-bold text-primary">{data.metrics.averageFairness}%</p>
                    )}
                    {label === "Total Analyses" && (
                      <p className="text-3xl font-bold text-primary">{data.metrics.totalAnalyses}</p>
                    )}
                    {label === "Bias Issues Found" && (
                      <p className="text-3xl font-bold text-destructive">{data.metrics.biasIssuesFound}</p>
                    )}
                    {label === "Content Improved" && (
                      <p className="text-3xl font-bold text-primary">{data.metrics.contentImproved}</p>
                    )}
                  </>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {label === "Total Analyses" ? "Across all content types" : ""}
                </p>
              </Card>
            ))}
          </div>

            {/* Charts Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Fairness Score Trend */}
            <Card className="p-6 bg-gradient-to-br from-background to-secondary/5 border border-border hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Fairness Score Trend</h3>
              {loading ? (
                <Skeleton className="h-[300px] w-full rounded-md" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart 
                    data={data?.historicalScores ?? []}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="fairnessGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
                    <XAxis 
                      dataKey="date" 
                      stroke="var(--color-muted-foreground)"
                      tickLine={false}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="var(--color-muted-foreground)"
                      domain={[0, 100]}
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                      fontSize={12}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'Fairness Score']}
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="none"
                      fill="url(#fairnessGradient)"
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-card)", stroke: "var(--color-primary)", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "var(--color-primary)", strokeWidth: 2, fill: "var(--color-card)" }}
                      isAnimationActive={true}
                    />
                </LineChart>
</ResponsiveContainer>
              )}
            </Card>

            {/* Bias Distribution */}
            <Card className="p-6 bg-gradient-to-br from-background to-secondary/5 border border-border hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <h3 className="text-lg font-semibold text-foreground">Bias Type Distribution</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Gender Bias", "Age Bias", "Cultural Bias", "Racial Bias", "Religious Bias", "Ableist Language"].map((biasType) => (
                    <Badge
                      key={biasType}
                      variant="outline"
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedBiasTypes.includes(biasType) 
                        ? "bg-primary/20 border-primary text-primary font-medium shadow-sm" 
                        : "hover:bg-primary/10 hover:border-primary/50"
                      }`}
                      onClick={() => {
                        setSelectedBiasTypes(prev => 
                          prev.includes(biasType) 
                            ? prev.filter(t => t !== biasType)
                            : [...prev, biasType]
                        )
                        setRefreshTrigger(prev => prev + 1)
                      }}
                    >
                      {biasType}
                    </Badge>
                  ))}
                </div>
              </div>
              {loading ? (
                <Skeleton className="h-[300px] w-full rounded-md" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data?.biasDistribution ?? []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, cx, cy, midAngle, innerRadius, outerRadius }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = 25 + innerRadius + (outerRadius - innerRadius);
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text
                            x={x}
                            y={y}
                            fill="var(--color-foreground)"
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                            fontSize={12}
                          >
                            {`${name}: ${value}%`}
                          </text>
                        );
                      }}
                      outerRadius={90}
                      innerRadius={50}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                      isAnimationActive={true}
                    >
                      {(data?.biasDistribution || []).map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke="var(--color-background)"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'Occurrence']}
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                </PieChart>
</ResponsiveContainer>
              )}
            </Card>
          </div>

          {/* Recent Analyses */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">Recent Analyses</h3>
            <div className="space-y-4">
              {loading && (
                <>
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                </>
              )}
              {(data?.recentAnalyses || []).map((analysis) => (
                <Card
                  key={analysis.id}
                  className="p-6 bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md animate-in fade-in-50 slide-in-from-bottom-2"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-2">{analysis.title}</h4>
                      <p className="text-sm text-muted-foreground">{analysis.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{analysis.score}%</p>
                        <Badge className={`${getStatusColor(analysis.score)} border-0`}>
                          {analysis.status}
                        </Badge>
                      </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-transparent" 
                            onClick={() => openReport(analysis.id)}
                          >
                            View Report
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-transparent whitespace-nowrap" 
                            onClick={() => handleApplyFix(analysis.id)}
                          >
                            Apply Fix
                          </Button>
                        </div>
                    </div>
                  </div>
                </Card>
              ))}
              {!loading && (data?.recentAnalyses?.length ?? 0) === 0 && (
                <Card className="p-6 bg-card border border-border text-muted-foreground">
                  No analyses yet. Try running one from the Analyze page.
                </Card>
              )}
            </div>
          </div>

          {/* Recommendations */}
<div>
            <h3 className="text-2xl font-bold text-foreground mb-6">Top Recommendations</h3>
            <div className="space-y-4">
              {loading && (
                <>
                  <Skeleton className="h-24 w-full rounded-lg" />
                </>
              )}
              {(data?.recommendations || []).map((rec, idx) => (
                <Card key={idx} className="p-6 bg-card border border-border animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                          {rec.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            rec.impact === "High"
                              ? "bg-destructive/10 text-destructive border-destructive/30"
                              : "bg-yellow-100 text-yellow-800 border-yellow-300"
                          }
                        >
                          {rec.impact} Impact
                        </Badge>
                      </div>
                      <p className="font-semibold text-foreground mb-2">{rec.issue}</p>
                      <p className="text-sm text-muted-foreground mb-3">{rec.suggestion}</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent whitespace-nowrap" onClick={applyFix}>
                      Apply Fix
                    </Button>
                  </div>
                </Card>
              ))}
              {!loading && (data?.recommendations?.length ?? 0) === 0 && (
                <Card className="p-6 bg-card border border-border text-muted-foreground">
                  No recommendations yet.
                </Card>
              )}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to analyze more content?</h3>
            <p className="text-muted-foreground mb-6">
              Upload your next job description, interview script, or assessment to get instant bias detection.
            </p>
            <Link href="/analyze">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Analyze New Content
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title || 'Analysis Report'}</DialogTitle>
            <DialogDescription>Fairness Score: {selected?.fairnessScore ?? '—'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[50vh] overflow-auto">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Original Text</p>
              <p className="text-sm whitespace-pre-wrap">{selected?.originalText || '—'}</p>
            </div>
            {selected?.improvedText && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Improved Text</p>
                <p className="text-sm whitespace-pre-wrap">{selected?.improvedText}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={applyFix}>Copy Improved</Button>
            <Button
              variant="outline"
              onClick={async () => {
                if (!selected) return
                const res = await fetch('/api/export/pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                  title: selected.title,
                  originalText: selected.originalText,
                  improvedText: selected.improvedText,
                  fairnessScore: selected.fairnessScore,
                  biasTypes: selected.biasTypes,
                }) })
                const blob = await res.blob()
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'fairassess-report.pdf'
                document.body.appendChild(a)
                a.click()
                a.remove()
                URL.revokeObjectURL(url)
              }}
            >
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
