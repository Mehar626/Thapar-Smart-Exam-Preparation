'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarDays, CheckCircle2, Clock, Sparkles, BookOpen, Dumbbell } from 'lucide-react'
import Link from 'next/link'

interface StudyPlanViewProps {
  courseId: string
  courseCode: string
}

export function StudyPlanView({ courseId, courseCode }: StudyPlanViewProps) {
  const planDays = [
    {
      day: 'Day 1 (Oct 10)',
      focus: 'Unit 1: Process Framework & Waterfall vs Agile',
      timeAllocated: '2.5 Hours',
      weightageCovered: '35% of MST',
      tasks: [
        'Review Slide Set 3 (Generic Process Framework & Linear Models).',
        'Practice 2022 Q1 and 2023 Q1(a): Justify Waterfall over Scrum for regulated systems.',
        'Review the 4 core Agile Manifesto values.',
      ],
      actionLink: `/courses/${courseId}/practice`,
      actionLabel: 'Practice Unit 1 PYQs',
    },
    {
      day: 'Day 2 (Oct 11)',
      focus: 'Unit 1: Agile Scrum Mechanics & XP (Concept Gap)',
      timeAllocated: '2 Hours',
      weightageCovered: '20% of MST',
      tasks: [
        'Revise Scrum team roles: Product Owner vs Scrum Master vs Developers.',
        'Study Extreme Programming (XP) practices: Pair Programming benefits and TDD.',
        'Review the distinction between Sprint Review and Sprint Retrospective.',
      ],
      actionLink: `/courses/${courseId}/practice`,
      actionLabel: 'Practice Scrum Questions',
    },
    {
      day: 'Day 3 (Oct 12)',
      focus: 'Unit 2: Requirements Engineering & IEEE 830',
      timeAllocated: '3 Hours',
      weightageCovered: '35% of MST',
      tasks: [
        'Practice formulating Functional and Non-Functional Requirements for campus portals.',
        'Review IEEE 830 SRS documentation structure and verification criteria.',
        'Draw Level-1 Data Flow Diagrams (DFDs) and Use Case diagrams for hospital or hostel systems.',
      ],
      actionLink: `/courses/${courseId}/practice`,
      actionLabel: 'Practice IEEE 830 PYQs',
    },
    {
      day: 'Day 4 (Oct 13 - Day Before MST)',
      focus: 'Timed Simulation & Weak-Topic Consolidation',
      timeAllocated: '2 Hours',
      weightageCovered: 'Full MST Readiness',
      tasks: [
        'Attempt a 30-minute Timed Mock Exam in Quiz Mode.',
        'Review any missed topics from the diagnostic report.',
        'Quick pass over command words: "Compare & Contrast", "Formulate", "Differentiate".',
      ],
      actionLink: `/courses/${courseId}/quiz`,
      actionLabel: 'Take Timed Mock MST',
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-3">
        <CalendarDays className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs">
          <div className="font-bold text-foreground">
            Targeted 4-Day MST Revision Roadmap
          </div>
          <p className="text-muted-foreground">
            Automatically scheduled leading up to the MST on Oct 14th based on your academic calendar and historical topic weightages.
          </p>
        </div>
      </div>

      {/* ── Days Timeline ── */}
      <div className="space-y-4">
        {planDays.map((step, idx) => (
          <Card key={idx} className="border-border/70 p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {step.day}
                </span>
                <h4 className="font-bold text-sm text-foreground">
                  {step.focus}
                </h4>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className="font-mono text-[11px]">
                  <Clock className="h-3 w-3 mr-1 text-primary" />
                  {step.timeAllocated}
                </Badge>
                <Badge variant="secondary" className="text-[11px]">
                  {step.weightageCovered}
                </Badge>
              </div>
            </div>

            <ul className="space-y-1.5 text-xs text-foreground/90">
              {step.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex justify-end">
              <Button asChild size="sm" variant="outline" className="text-xs">
                <Link href={step.actionLink}>
                  <Dumbbell className="h-3.5 w-3.5 mr-1.5" />
                  {step.actionLabel}
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
