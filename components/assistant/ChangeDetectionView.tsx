'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, RefreshCw, Layers, BookOpen, AlertCircle } from 'lucide-react'
import { PatternChangeShifts } from '@/lib/analytics/pattern'

interface ChangeDetectionViewProps {
  shifts: PatternChangeShifts
}

export function ChangeDetectionView({ shifts }: ChangeDetectionViewProps) {
  return (
    <div className="space-y-6">
      {/* ── Banner: Shift Context ── */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-3">
        <RefreshCw className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs">
          <div className="font-bold text-foreground">
            Multi-Year Pattern Trajectory Analysis
          </div>
          <p className="text-muted-foreground">
            Comparing older papers ({shifts.olderYears.join(', ')}) against recent papers ({shifts.recentYears.join(', ')}).
            Identifies changes in professor question styles, new diagram expectations, and topic shifts.
          </p>
        </div>
      </div>

      {/* ── Detected Pattern Shifts ── */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground">
          Observed Pattern Shifts in Recent Papers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {shifts.shifts.map((shift, idx) => {
            const isUp = shift.trend === 'INCREASED'
            const isDown = shift.trend === 'DECREASED'

            return (
              <Card key={idx} className="border-border/70 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground">
                    {shift.category}
                  </span>
                  <Badge
                    variant={isUp ? 'default' : isDown ? 'destructive' : 'secondary'}
                    className="text-[10px] font-bold flex items-center gap-1"
                  >
                    {isUp && <TrendingUp className="h-3 w-3" />}
                    {isDown && <TrendingDown className="h-3 w-3" />}
                    {shift.trend}
                  </Badge>
                </div>

                <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                  {shift.observation}
                </p>

                <div className="p-2 rounded bg-muted/30 border border-border/40 text-[11px] text-muted-foreground">
                  <strong>Metric Shift:</strong> {shift.metricChange}
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* ── Slide Emphasis vs PYQ Alignment ── */}
      <Card className="border-border/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Lecture Slide Emphasis vs Exam Coverage
          </CardTitle>
          <CardDescription className="text-xs">
            Correlates lecture slide depth with historical examination marks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th className="pb-2 font-semibold">Curriculum Module</th>
                  <th className="pb-2 font-semibold">Slide Depth</th>
                  <th className="pb-2 font-semibold">Exam History</th>
                  <th className="pb-2 font-semibold">Predictive Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {shifts.slideEmphasisAlignment.map((row, idx) => (
                  <tr key={idx} className="py-2.5">
                    <td className="py-2.5 font-medium text-foreground pr-3">
                      {row.topic}
                    </td>
                    <td className="py-2.5 text-muted-foreground font-mono pr-3">
                      {row.slidesCount} Slides
                    </td>
                    <td className="py-2.5 pr-3">
                      <Badge variant="outline" className="text-[10px]">
                        {row.pyqCoverage}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-xs text-muted-foreground">
                      {row.alignmentNote}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
