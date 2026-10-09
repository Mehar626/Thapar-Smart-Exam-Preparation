'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { QuestionCard } from './QuestionCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Dumbbell, Sparkles, X } from 'lucide-react'

interface QuestionItem {
  id: string
  questionNumber: string | null
  text: string
  marks: number
  evalType: string
  year: number
  type: string
  difficulty: string
  topicTags: string[]
  sourceDocument?: {
    title: string
  } | null
  solutions: Array<{
    id: string
    content: string
    authorType: 'AI' | 'USER' | 'MODERATOR'
    isVerified: boolean
    verifiedBy?: string | null
    upvotes: number
    downvotes: number
    author?: {
      name: string
    } | null
  }>
}

interface QuestionBankExplorerProps {
  courseId: string
  courseCode: string
  questions: QuestionItem[]
}

export function QuestionBankExplorer({
  courseId,
  courseCode,
  questions,
}: QuestionBankExplorerProps) {
  const [search, setSearch] = useState('')
  const [selectedEvalType, setSelectedEvalType] = useState<string>('ALL')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL')
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL')

  // Extract distinct metadata
  const evalTypes = useMemo(
    () => Array.from(new Set(questions.map((q) => q.evalType))),
    [questions]
  )
  const allTopics = useMemo(() => {
    const set = new Set<string>()
    questions.forEach((q) => q.topicTags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [questions])

  // Filter questions
  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (selectedEvalType !== 'ALL' && q.evalType !== selectedEvalType) return false
      if (selectedDifficulty !== 'ALL' && q.difficulty !== selectedDifficulty) return false
      if (selectedTopic !== 'ALL' && !q.topicTags.includes(selectedTopic)) return false

      if (search.trim()) {
        const query = search.toLowerCase()
        const matchText = q.text.toLowerCase().includes(query)
        const matchTags = q.topicTags.some((t) => t.toLowerCase().includes(query))
        const matchNum = q.questionNumber?.toLowerCase().includes(query)
        if (!matchText && !matchTags && !matchNum) return false
      }

      return true
    })
  }, [questions, selectedEvalType, selectedDifficulty, selectedTopic, search])

  const hasActiveFilters =
    search || selectedEvalType !== 'ALL' || selectedDifficulty !== 'ALL' || selectedTopic !== 'ALL'

  function clearFilters() {
    setSearch('')
    setSelectedEvalType('ALL')
    setSelectedDifficulty('ALL')
    setSelectedTopic('ALL')
  }

  return (
    <div className="space-y-6">
      {/* ── Search & Actions Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions by topic, keyword, or Q#..."
            className="pl-9 h-9 text-xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="brand-gradient text-white border-0 shadow-sm">
            <Link href={`/courses/${courseId}/practice`}>
              <Dumbbell className="h-3.5 w-3.5 mr-1.5" />
              Start Practice Session
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/courses/${courseId}/quiz`}>
              Mock Quiz
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Filter Pills ── */}
      <div className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-3">
        {/* Eval Types */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground font-semibold mr-1">Exam Type:</span>
          <button
            onClick={() => setSelectedEvalType('ALL')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              selectedEvalType === 'ALL'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            All Exams
          </button>
          {evalTypes.map((et) => (
            <button
              key={et}
              onClick={() => setSelectedEvalType(et)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedEvalType === et
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {et}
            </button>
          ))}
        </div>

        {/* Difficulty */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground font-semibold mr-1">Difficulty:</span>
          {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-0.5 rounded-md text-xs font-medium transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Topics Dropdown / Pills */}
        {allTopics.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1 border-t border-border/40">
            <span className="text-muted-foreground font-semibold mr-1">Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="text-xs px-2.5 py-1 rounded-md border border-border/60 bg-background text-foreground"
            >
              <option value="ALL">All Curriculum Topics ({allTopics.length})</option>
              {allTopics.map((top) => (
                <option key={top} value={top}>
                  {top}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 text-xs text-muted-foreground hover:text-foreground ml-auto"
              >
                <X className="h-3 w-3 mr-1" />
                Reset Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ── Results Count ── */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing <strong>{filtered.length}</strong> of <strong>{questions.length}</strong> questions
        </span>
      </div>

      {/* ── Questions List ── */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-border/80 space-y-3">
          <p className="text-sm font-semibold">No questions match the selected filters</p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((question) => (
            <QuestionCard
              key={question.id}
              courseId={courseId}
              question={question}
            />
          ))}
        </div>
      )}
    </div>
  )
}
