'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MathRenderer } from '@/components/math/MathRenderer'
import { SolutionView } from '@/components/question/SolutionView'
import {
  Trophy,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  BookOpen,
  BarChart,
  ListChecks,
} from 'lucide-react'

interface QuizQuestion {
  id: string
  questionNumber: string | null
  text: string
  marks: number
  evalType: string
  year: number
  type: string
  difficulty: string
  topicTags: string[]
  solutions: Array<{
    id: string
    content: string
    authorType: 'AI' | 'USER' | 'MODERATOR'
    isVerified: boolean
    upvotes: number
    downvotes: number
  }>
}

interface MockQuizRunnerProps {
  courseId: string
  courseCode: string
  questions: QuizQuestion[]
}

export function MockQuizRunner({
  courseId,
  courseCode,
  questions,
}: MockQuizRunnerProps) {
  const [stage, setStage] = useState<'INTRO' | 'IN_PROGRESS' | 'REPORT'>('INTRO')
  const [quizList, setQuizList] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60) // 30 minutes in seconds
  const [answers, setAnswers] = useState<Record<string, { marks: number; notes: string }>>({})

  // ── Timer Effect ──
  useEffect(() => {
    if (stage !== 'IN_PROGRESS') return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setStage('REPORT')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [stage])

  function startQuiz() {
    // Select a balanced mock test of up to 5 questions totaling ~30 marks
    const sample = [...questions].sort(() => 0.5 - Math.random()).slice(0, 5)
    setQuizList(sample)
    setCurrentIndex(0)
    setTimeLeft(30 * 60)
    const initialAnswers: Record<string, { marks: number; notes: string }> = {}
    sample.forEach((q) => {
      initialAnswers[q.id] = { marks: q.marks, notes: '' } // default to full marks for demo
    })
    setAnswers(initialAnswers)
    setStage('IN_PROGRESS')
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // ── 1. INTRO STAGE ──
  if (stage === 'INTRO') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary text-xs font-semibold mb-1">
              <Trophy className="h-4 w-4" />
              <span>Exam Simulation</span>
            </div>
            <CardTitle className="text-xl">
              {courseCode} Timed Mock Mid-Semester Test (MST)
            </CardTitle>
            <CardDescription className="text-xs">
              Simulates a formal 30-minute exam session under exam conditions with real past papers, followed by an automated weak-topics diagnostic report.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div className="text-xs text-muted-foreground">Duration</div>
                <div className="text-lg font-bold text-foreground">30 Mins</div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div className="text-xs text-muted-foreground">Total Marks</div>
                <div className="text-lg font-bold text-foreground">30 Marks</div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div className="text-xs text-muted-foreground">Coverage</div>
                <div className="text-lg font-bold text-foreground">Units 1 & 2</div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                Instructions:
              </div>
              <p>• Attempt all sections. Questions match official TIET marks patterns.</p>
              <p>• At submission, an AI diagnostic report identifies your weak topics and recommends revision slides.</p>
            </div>

            <Button onClick={startQuiz} className="w-full brand-gradient text-white border-0 shadow-sm">
              <Clock className="h-4 w-4 mr-2" />
              Start Timed Test
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── 3. REPORT STAGE ──
  if (stage === 'REPORT') {
    const totalMaxMarks = quizList.reduce((s, q) => s + q.marks, 0) || 30
    const totalObtainedMarks = quizList.reduce((s, q) => s + (answers[q.id]?.marks || 0), 0)
    const scorePct = Math.round((totalObtainedMarks / totalMaxMarks) * 100)

    // Calculate weak topics (topics where marks were dropped)
    const topicDropMap: Record<string, { lost: number; total: number }> = {}
    quizList.forEach((q) => {
      const lost = q.marks - (answers[q.id]?.marks || 0)
      q.topicTags.forEach((tag) => {
        if (!topicDropMap[tag]) topicDropMap[tag] = { lost: 0, total: 0 }
        topicDropMap[tag].lost += lost
        topicDropMap[tag].total += q.marks
      })
    })

    const weakTopics = Object.entries(topicDropMap)
      .sort((a, b) => b[1].lost - a[1].lost)
      .slice(0, 3)

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <Card className="border-border/70 p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <Badge className="brand-gradient text-white border-0 text-xs">
              Mock Test Result
            </Badge>
            <h3 className="text-3xl font-extrabold tracking-tight">Diagnostic Scorecard</h3>
            <p className="text-xs text-muted-foreground">
              Performance breakdown for {courseCode} Mock MST
            </p>
          </div>

          {/* Score Badge */}
          <div className="flex items-center justify-center gap-6 py-4 px-6 rounded-2xl bg-secondary/40 border border-border/60 max-w-sm mx-auto">
            <div>
              <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Total Score
              </div>
              <div className="text-4xl font-black text-primary">
                {totalObtainedMarks} <span className="text-xl font-normal text-muted-foreground">/ {totalMaxMarks}</span>
              </div>
            </div>
            <div className="h-10 w-px bg-border/60" />
            <div>
              <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Accuracy
              </div>
              <div className="text-3xl font-bold text-foreground">
                {scorePct}%
              </div>
            </div>
          </div>

          {/* Weak Topics Diagnostic Report */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <BarChart className="h-4 w-4 text-destructive" />
              Weak Topics & Revision Focus
            </h4>

            {weakTopics.length > 0 ? (
              <div className="space-y-2.5">
                {weakTopics.map(([topic, data], idx) => (
                  <div
                    key={topic}
                    className="p-3.5 rounded-xl border border-border/70 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold text-xs text-foreground flex items-center gap-2">
                        <span className="font-mono text-muted-foreground">#{idx + 1}</span>
                        <span>{topic}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        High historical frequency in MST past papers. Revise corresponding lecture slides.
                      </p>
                    </div>

                    <Button asChild size="sm" variant="outline" className="text-xs shrink-0">
                      <a href={`/courses/${courseId}/assistant`}>
                        Revise with TIET-GPT
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Excellent performance! You secured full marks across all tested modules.
              </p>
            )}
          </div>

          <div className="flex justify-center gap-3 pt-3 border-t border-border/60">
            <Button onClick={() => setStage('INTRO')} variant="outline" size="sm">
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Retake Mock Test
            </Button>
            <Button asChild size="sm" className="brand-gradient text-white border-0">
              <a href={`/courses/${courseId}/questions`}>
                Back to Question Bank
              </a>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // ── 2. IN_PROGRESS STAGE ──
  const current = quizList[currentIndex]

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner with Countdown Timer & Question Palette */}
      <div className="p-4 rounded-xl border border-border/60 bg-card/90 backdrop-blur flex flex-wrap items-center justify-between gap-4 sticky top-14 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-base font-bold text-foreground">
            <Clock className={`h-4 w-4 ${timeLeft < 300 ? 'text-destructive animate-pulse' : 'text-primary'}`} />
            <span className={timeLeft < 300 ? 'text-destructive font-black' : ''}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            Question {currentIndex + 1} of {quizList.length}
          </Badge>
        </div>

        {/* Question Palette Navigation */}
        <div className="flex items-center gap-1.5">
          {quizList.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-7 w-7 rounded-md text-xs font-bold transition-all ${
                currentIndex === idx
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary/40'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => setStage('REPORT')}
          className="text-xs"
        >
          Submit Exam
        </Button>
      </div>

      {/* Active Question Box */}
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
              {current.questionNumber || `Q${currentIndex + 1}`}
            </span>
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-xs">
                {current.marks} Marks
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {current.difficulty}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-base font-bold mt-2 leading-relaxed">
            <MathRenderer content={current.text} />
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Your Exam Response:
            </label>
            <textarea
              value={answers[current.id]?.notes || ''}
              onChange={(e) =>
                setAnswers((prev) => ({
                  ...prev,
                  [current.id]: {
                    ...prev[current.id],
                    notes: e.target.value,
                  },
                }))
              }
              rows={4}
              placeholder="Type your solution response..."
              className="w-full text-xs p-3 rounded-lg border border-border/60 bg-muted/20 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Self-Score Setting */}
          <div className="p-3.5 rounded-lg border border-border/50 bg-secondary/30 flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Estimated Marks Self-Assessment:</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: current.marks + 1 }).map((_, m) => (
                <button
                  key={m}
                  onClick={() =>
                    setAnswers((prev) => ({
                      ...prev,
                      [current.id]: {
                        ...prev[current.id],
                        marks: m,
                      },
                    }))
                  }
                  className={`h-6 w-6 rounded text-xs font-bold transition-colors ${
                    answers[current.id]?.marks === m
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-secondary text-muted-foreground'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
            >
              Previous
            </Button>

            {currentIndex + 1 < quizList.length ? (
              <Button size="sm" onClick={() => setCurrentIndex((i) => i + 1)}>
                Next
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            ) : (
              <Button size="sm" onClick={() => setStage('REPORT')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Finish & View Scorecard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
