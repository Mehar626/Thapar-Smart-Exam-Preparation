'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, X, Sparkles, Loader2, ChevronDown, ChevronUp, Tag } from 'lucide-react'
import { approveQuestionAction, rejectQuestionAction } from '@/app/admin/actions'

interface QuestionReviewCardProps {
  question: {
    id: string
    questionNumber: string | null
    text: string
    marks: number
    type: string
    difficulty: string
    topicTags: string[]
    confidence: number | null
    course: {
      code: string
      name: string
    }
    sourceDocument?: {
      title: string
    } | null
    solutions: Array<{
      id: string
      content: string
      authorType: string
      isVerified: boolean
    }>
  }
}

export function QuestionReviewCard({ question }: QuestionReviewCardProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING')
  const [showSolution, setShowSolution] = useState(false)

  async function handleApprove() {
    setLoading(true)
    try {
      await approveQuestionAction(question.id)
      setStatus('APPROVED')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleReject() {
    setLoading(true)
    try {
      await rejectQuestionAction(question.id, 'Moderator rejected content')
      setStatus('REJECTED')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'APPROVED') {
    return (
      <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm flex items-center justify-between animate-fade-in">
        <span className="flex items-center gap-2 font-medium">
          <Check className="h-4 w-4" />
          {question.questionNumber || 'Question'} approved & embedded into pgvector bank.
        </span>
        <Badge variant="outline" className="border-emerald-500/40 text-xs">
          Approved
        </Badge>
      </div>
    )
  }

  if (status === 'REJECTED') {
    return (
      <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-sm flex items-center justify-between animate-fade-in">
        <span className="flex items-center gap-2 font-medium">
          <X className="h-4 w-4" />
          {question.questionNumber || 'Question'} rejected and removed from queue.
        </span>
        <Badge variant="destructive" className="text-xs">
          Rejected
        </Badge>
      </div>
    )
  }

  return (
    <Card className="border-border/70 hover:shadow-sm transition-shadow">
      <CardHeader className="pb-3 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
              {question.course.code}
            </span>
            <span className="font-bold text-sm text-foreground">
              {question.questionNumber || 'Q'}
            </span>
            <Badge variant="outline" className="text-xs">
              {question.marks} Marks
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {question.type}
            </Badge>
            <Badge
              variant={
                question.difficulty === 'HARD'
                  ? 'destructive'
                  : question.difficulty === 'EASY'
                  ? 'default'
                  : 'outline'
              }
              className="text-xs"
            >
              {question.difficulty}
            </Badge>
          </div>

          <div className="text-xs text-muted-foreground truncate max-w-[240px]">
            {question.sourceDocument?.title || 'Direct Upload'}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5 pb-4">
        {/* Question Text */}
        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans bg-muted/20 p-3 rounded-lg border border-border/40">
          {question.text}
        </div>

        {/* Topic Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 text-muted-foreground mr-1" />
          {question.topicTags.map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>

        {/* AI Solution Toggle */}
        {question.solutions.length > 0 && (
          <div className="border-t border-border/50 pt-2.5">
            <button
              type="button"
              onClick={() => setShowSolution((v) => !v)}
              className="flex items-center justify-between w-full text-xs font-semibold text-muted-foreground hover:text-foreground py-1"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Draft Solution (AI-generated, unverified)
              </span>
              {showSolution ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            {showSolution && (
              <div className="mt-2 text-xs text-foreground bg-amber-500/5 dark:bg-amber-950/10 p-3 rounded border border-amber-500/20 whitespace-pre-wrap leading-relaxed">
                <div className="mb-1 font-bold text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  ⚠️ AI-generated, unverified solution
                </div>
                {question.solutions[0].content}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
          <Button
            size="sm"
            variant="outline"
            onClick={handleReject}
            disabled={loading}
            className="text-destructive hover:bg-destructive/10"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Reject
          </Button>

          <Button
            size="sm"
            onClick={handleApprove}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <Check className="h-3.5 w-3.5 mr-1.5" />
            )}
            Approve & Embed
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
