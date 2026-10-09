'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react'
import { LikelyTopicPrediction } from '@/lib/analytics/pattern'

interface LikelyPredictionsViewProps {
  predictions: LikelyTopicPrediction[]
}

export function LikelyPredictionsView({ predictions }: LikelyPredictionsViewProps) {
  return (
    <div className="space-y-6">
      {/* ── Honesty Disclaimer ── */}
      <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-muted-foreground flex items-start gap-2.5">
        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-foreground">
            Academic Estimate Disclaimer
          </span>
          <p>
            These predictions are statistical probability estimates derived from approved TIET exam papers and slide allocations.
            They are <strong>not guarantees</strong>. Use them to prioritize study time strategically while covering the complete syllabus.
          </p>
        </div>
      </div>

      {/* ── Predictions List ── */}
      <div className="space-y-4">
        {predictions.map((pred, idx) => (
          <Card
            key={pred.topic}
            className="border-border/70 hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="p-4 sm:p-5 space-y-3.5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-black text-muted-foreground">
                    #{idx + 1}
                  </span>
                  <h3 className="font-extrabold text-base text-foreground">
                    {pred.topic}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Likelihood:</span>
                  <Badge
                    variant={
                      pred.confidenceScore >= 85
                        ? 'default'
                        : pred.confidenceScore >= 70
                        ? 'secondary'
                        : 'outline'
                    }
                    className="font-bold text-xs"
                  >
                    {pred.confidenceScore}% Confidence ({pred.confidenceLabel})
                  </Badge>
                </div>
              </div>

              {/* Rationale & Evidence */}
              <div className="space-y-2 text-xs">
                <p className="text-foreground/90 font-medium leading-relaxed">
                  {pred.evidence.rationale}
                </p>

                {/* Evidence Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40 space-y-1">
                    <span className="font-bold text-[11px] text-muted-foreground uppercase">
                      Past Paper Evidence:
                    </span>
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      {pred.evidence.pastPaperOccurrences.map((occ, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-background border border-border/40 font-mono text-foreground"
                        >
                          {occ}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40 space-y-1">
                    <span className="font-bold text-[11px] text-muted-foreground uppercase">
                      Lecture Slide References:
                    </span>
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      {pred.evidence.slideDecks.map((deck, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-background border border-border/40 text-foreground"
                        >
                          {deck}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommended Preparation Action */}
                <div className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 text-xs text-foreground flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span><strong>Recommended Action:</strong> {pred.recommendedAction}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
