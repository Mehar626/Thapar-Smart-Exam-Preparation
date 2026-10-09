'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MathRenderer } from '@/components/math/MathRenderer'
import { SolutionView } from '@/components/question/SolutionView'
import {
  Dumbbell,
  CheckCircle2,
  Eye,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  Sliders,
  Check,
} from 'lucide-react'
import {
  createPracticeSession,
  recordPracticeAttempt,
  completePracticeSession,
} from '@/app/courses/[id]/practice/actions'

interface PracticeQuestion {
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

interface PracticeSessionRunnerProps {
  courseId: string
  courseCode: string
  questions: PracticeQuestion[]
}

export function PracticeSessionRunner({
  courseId,
  courseCode,
  questions,
}: PracticeSessionRunnerProps) {
  // Session states: SETUP -> PRACTICING -> COMPLETED
  const [stage, setStage] = useState<'SETUP' | 'PRACTICING' | 'COMPLETED'>('SETUP')
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL')
  const [selectedEvalType, setSelectedEvalType] = useState<string>('ALL')
  const [questionCount, setQuestionCount] = useState<number>(5)

  // Active session variables
  const [activeList, setActiveList] = useState<PracticeQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [userNotes, setUserNotes] = useState('')
  const [earnedMarks, setEarnedMarks] = useState<number>(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [totalScore, setTotalScore] = useState(0)
  const [maxPossible, setMaxPossible] = useState(0)

  // Topics
  const allTopics = Array.from(
    new Set(questions.flatMap((q) => q.topicTags))
  ).sort()

  async function handleStart() {
    let pool = questions.filter((q) => {
      if (selectedEvalType !== 'ALL' && q.evalType !== selectedEvalType) return false
      if (selectedTopic !== 'ALL' && !q.topicTags.includes(selectedTopic)) return false
      return true
    })

    if (pool.length === 0) pool = questions

    // Shuffle and pick limit
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, questionCount)
    setActiveList(shuffled)
    setCurrentIndex(0)
    setRevealed(false)
    setUserNotes('')
    setEarnedMarks(0)
    setTotalScore(0)
    setMaxPossible(shuffled.reduce((sum, q) => sum + q.marks, 0))

    try {
      const res = await createPracticeSession(
        courseId,
        selectedEvalType !== 'ALL' ? (selectedEvalType as any) : undefined
      )
      setSessionId(res.sessionId)
    } catch (e) {
      console.error(e)
    }

    setStage('PRACTICING')
  }

  async function handleNextQuestion() {
    const currentQ = activeList[currentIndex]
    const nextScore = totalScore + earnedMarks
    setTotalScore(nextScore)

    if (sessionId) {
      try {
        await recordPracticeAttempt({
          sessionId,
          questionId: currentQ.id,
          selfMarks: earnedMarks,
          userAnswer: userNotes,
        })
      } catch (err) {
        console.error(err)
      }
    }

    if (currentIndex + 1 < activeList.length) {
      setCurrentIndex((i) => i + 1)
      setRevealed(false)
      setUserNotes('')
      setEarnedMarks(0)
    } else {
      // Completed!
      if (sessionId) {
        await completePracticeSession(sessionId, nextScore)
      }
      setStage('COMPLETED')
    }
  }

  // ── 1. SETUP STAGE ──
  if (stage === 'SETUP') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary text-xs font-semibold mb-1">
              <Dumbbell className="h-4 w-4" />
              <span>Targeted Practice Mode</span>
            </div>
            <CardTitle className="text-xl">Configure Your Practice Session</CardTitle>
            <CardDescription className="text-xs">
              Attempt authentic past-year questions, self-grade with verified solutions, and master high-yield topics without repetition.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Exam Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Examination Scope
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['ALL', 'MST', 'EST'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedEvalType(type)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                      selectedEvalType === type
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-border/60 hover:bg-secondary text-muted-foreground'
                    }`}
                  >
                    {type === 'ALL' ? 'All Exam Papers' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Target Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-border/60 bg-background text-foreground"
              >
                <option value="ALL">All Syllabus Topics</option>
                {allTopics.map((top) => (
                  <option key={top} value={top}>
                    {top}
                  </option>
                ))}
              </select>
            </div>

            {/* Question Count */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                      questionCount === num
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-border/60 hover:bg-secondary text-muted-foreground'
                    }`}
                  >
                    {num} Questions
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleStart} className="w-full brand-gradient text-white border-0 shadow-sm">
              <Dumbbell className="h-4 w-4 mr-2" />
              Begin Practice
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── 3. COMPLETED STAGE ──
  if (stage === 'COMPLETED') {
    const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 100

    return (
      <div className="max-w-xl mx-auto space-y-6 text-center animate-fade-in">
        <Card className="border-border/70 p-8 space-y-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary w-fit mx-auto">
            <Trophy className="h-10 w-10 text-accent" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold tracking-tight">Practice Complete!</h3>
            <p className="text-xs text-muted-foreground">
              Great job practicing authentic {courseCode} exam questions.
            </p>
          </div>

          <div className="py-4 rounded-xl bg-secondary/50 border border-border/50 max-w-xs mx-auto">
            <div className="text-3xl font-black text-primary">
              {totalScore} / {maxPossible}
            </div>
            <div className="text-xs font-medium text-muted-foreground mt-0.5">
              Score: {percentage}%
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Button onClick={() => setStage('SETUP')} variant="outline" size="sm">
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Practice Another Set
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

  // ── 2. PRACTICING STAGE ──
  const current = activeList[currentIndex]

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Progress Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Question <strong>{currentIndex + 1}</strong> of <strong>{activeList.length}</strong>
        </span>
        <Badge variant="outline" className="text-xs">
          {current.evalType} {current.year} • {current.marks} Marks
        </Badge>
      </div>

      <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / activeList.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
              {current.questionNumber || `Q${currentIndex + 1}`}
            </span>
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary" className="text-xs">
                {current.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {current.type}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-base font-bold mt-2 leading-relaxed">
            <MathRenderer content={current.text} />
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {/* Scratchpad notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Your Draft Answer / Working Notes:
            </label>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              rows={3}
              placeholder="Outline your reasoning, formulas, or bullet points before revealing the model solution..."
              className="w-full text-xs p-3 rounded-lg border border-border/60 bg-muted/20 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Reveal Button */}
          {!revealed ? (
            <Button
              onClick={() => {
                setRevealed(true)
                setEarnedMarks(current.marks) // default to full marks for quick self-marking
              }}
              className="w-full"
              variant="outline"
            >
              <Eye className="h-4 w-4 mr-2" />
              Reveal Solution & Self-Grade
            </Button>
          ) : (
            <div className="space-y-4 pt-3 border-t border-border/60 animate-fade-in">
              <SolutionView
                questionId={current.id}
                courseId={courseId}
                solutions={current.solutions as any}
              />

              {/* Self-grading controls */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">Self-Mark Your Attempt:</span>
                  <span className="font-bold text-primary font-mono text-sm">
                    {earnedMarks} / {current.marks} Marks
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {Array.from({ length: current.marks + 1 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEarnedMarks(i)}
                      className={`flex-1 py-1.5 rounded text-xs font-bold border transition-colors ${
                        earnedMarks === i
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-secondary text-muted-foreground'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleNextQuestion}
                className="w-full brand-gradient text-white border-0 shadow-sm"
              >
                {currentIndex + 1 < activeList.length ? 'Next Question' : 'Finish Practice'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
