'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, HelpCircle, Layers, Award, FileText, CheckCircle2 } from 'lucide-react'
import { DeterministicPatternStats } from '@/lib/analytics/pattern'

interface PatternAnalysisViewProps {
  stats: DeterministicPatternStats
}

export function PatternAnalysisView({ stats }: PatternAnalysisViewProps) {
  return (
    <div className="space-y-6">
      {/* ── Key Metrics Overview ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl border border-border/70 bg-card/60">
          <div className="text-xs text-muted-foreground">Papers Analyzed</div>
          <div className="text-2xl font-black text-foreground mt-0.5">
            {stats.totalPapersAnalyzed}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {stats.yearsAnalyzed.join(', ')}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-border/70 bg-card/60">
          <div className="text-xs text-muted-foreground">Avg Questions / Paper</div>
          <div className="text-2xl font-black text-primary mt-0.5">
            {stats.avgQuestionsPerPaper}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Section A & B</div>
        </div>

        <div className="p-3.5 rounded-xl border border-border/70 bg-card/60">
          <div className="text-xs text-muted-foreground">Total Exam Marks</div>
          <div className="text-2xl font-black text-foreground mt-0.5">
            {stats.avgPaperMarks}M
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">2 Hours Duration</div>
        </div>

        <div className="p-3.5 rounded-xl border border-border/70 bg-card/60">
          <div className="text-xs text-muted-foreground">Average Difficulty</div>
          <div className="text-2xl font-black text-amber-500 mt-0.5">
            Medium
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Balanced Distribution</div>
        </div>
      </div>

      {/* ── Question Types & Difficulty Distributions ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Marks by Question Type */}
        <Card className="border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Marks Share by Question Type
            </CardTitle>
            <CardDescription className="text-xs">
              Proportion of total marks allocated per question style
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(stats.typeDistribution).map(([type, data]) => (
              <div key={type} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">{type} Answers</span>
                  <span className="text-muted-foreground">
                    {data.percentage}% ({data.marks}M total)
                  </span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Difficulty Share */}
        <Card className="border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              Difficulty Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Exam paper cognitive rigor classification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(stats.difficultyDistribution).map(([diff, data]) => (
              <div key={diff} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">{diff}</span>
                  <span className="text-muted-foreground">{data.percentage}%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      diff === 'HARD'
                        ? 'bg-destructive'
                        : diff === 'EASY'
                        ? 'bg-emerald-500'
                        : 'bg-primary'
                    }`}
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Typical Phrasing & Command Words ── */}
      <Card className="border-border/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Typical TIET Phrasing & Command Words
          </CardTitle>
          <CardDescription className="text-xs">
            Most frequent verbs professors use in questions across previous examinations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {stats.commandWords.map((cw) => (
              <div
                key={cw.word}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-xs"
              >
                <span className="font-bold text-foreground">"{cw.word}"</span>
                <Badge variant="secondary" className="text-[10px]">
                  {cw.percentage}% of questions
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Repeated Question Themes Across Years ── */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          Recurring Question Themes
        </h3>

        <div className="space-y-2.5">
          {stats.repeatedThemes.map((theme, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl border border-border/70 bg-card/60 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground">
                  {theme.theme}
                </span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  Appeared {theme.frequency}× ({theme.years.join(', ')})
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground italic bg-muted/20 p-2 rounded border border-border/40">
                "{theme.sampleQuestion}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
