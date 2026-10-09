'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MathRenderer } from '@/components/math/MathRenderer'
import { ThumbsUp, ThumbsDown, CheckCircle2, AlertTriangle, Plus, Send, User, Sparkles } from 'lucide-react'
import { voteSolution, submitCommunitySolution } from '@/app/courses/[id]/questions/actions'

interface SolutionItem {
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
}

interface SolutionViewProps {
  questionId: string
  courseId: string
  solutions: SolutionItem[]
}

export function SolutionView({ questionId, courseId, solutions }: SolutionViewProps) {
  const [submitting, setSubmitting] = useState(false)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [newSolutionText, setNewSolutionText] = useState('')
  const [localSolutions, setLocalSolutions] = useState(solutions)

  async function handleVote(solutionId: string, isUpvote: boolean) {
    try {
      await voteSolution(solutionId, isUpvote)
      setLocalSolutions((prev) =>
        prev.map((s) => {
          if (s.id === solutionId) {
            return {
              ...s,
              upvotes: isUpvote ? s.upvotes + 1 : s.upvotes,
              downvotes: !isUpvote ? s.downvotes + 1 : s.downvotes,
            }
          }
          return s
        })
      )
    } catch (err) {
      console.error(err)
    }
  }

  async function handleAddSolution(e: React.FormEvent) {
    e.preventDefault()
    if (!newSolutionText.trim()) return
    setSubmitting(true)
    try {
      await submitCommunitySolution(questionId, newSolutionText, courseId)
      setShowSubmitForm(false)
      setNewSolutionText('')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 pt-3 border-t border-border/60">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Solutions ({localSolutions.length})
        </span>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-primary"
          onClick={() => setShowSubmitForm((v) => !v)}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          {showSubmitForm ? 'Cancel' : 'Submit Solution'}
        </Button>
      </div>

      {/* ── Submit Community Solution Form ── */}
      {showSubmitForm && (
        <form onSubmit={handleAddSolution} className="p-3.5 rounded-lg border border-border/70 bg-muted/20 space-y-3 animate-fade-in">
          <div className="text-xs font-medium text-foreground">
            Write your step-by-step solution (Markdown and math like $x^2$ supported):
          </div>
          <textarea
            value={newSolutionText}
            onChange={(e) => setNewSolutionText(e.target.value)}
            rows={4}
            className="w-full text-xs p-2.5 rounded-md border border-border/60 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="1. First analyze the requirement...&#10;2. Apply the formula $Effort = a \times (KLOC)^b$..."
            required
          />
          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={submitting || newSolutionText.trim().length < 15}
            >
              <Send className="h-3 w-3 mr-1.5" />
              {submitting ? 'Submitting...' : 'Post Solution'}
            </Button>
          </div>
        </form>
      )}

      {/* ── Solutions List ── */}
      <div className="space-y-3">
        {localSolutions.map((sol) => {
          const isAi = sol.authorType === 'AI'
          const isVerified = sol.isVerified

          return (
            <div
              key={sol.id}
              className={`rounded-xl border p-4 transition-all ${
                isVerified
                  ? 'border-emerald-500/30 bg-emerald-500/[0.03]'
                  : isAi
                  ? 'border-amber-500/25 bg-amber-500/[0.02]'
                  : 'border-border/60 bg-card/60'
              }`}
            >
              {/* Badge & Author Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                  {isVerified ? (
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-semibold">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified by moderator/senior
                    </Badge>
                  ) : isAi ? (
                    <Badge variant="warning" className="text-[11px] font-semibold">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      AI-generated, unverified
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[11px]">
                      <User className="h-3 w-3 mr-1" />
                      Community Solution
                    </Badge>
                  )}

                  <span className="text-xs text-muted-foreground">
                    {isAi
                      ? 'TIET-GPT Ingestion Model'
                      : sol.author?.name || 'Peer Contributor'}
                  </span>
                </div>

                {/* Vote Controls */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => handleVote(sol.id, true)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-secondary transition-colors text-foreground"
                    title="Upvote solution"
                  >
                    <ThumbsUp className="h-3 w-3 text-emerald-500" />
                    <span>{sol.upvotes}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVote(sol.id, false)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-secondary transition-colors"
                    title="Downvote or report incorrect"
                  >
                    <ThumbsDown className="h-3 w-3 text-destructive" />
                    <span>{sol.downvotes}</span>
                  </button>
                </div>
              </div>

              {/* Solution Body */}
              <div className="text-xs sm:text-sm text-foreground/90">
                <MathRenderer content={sol.content} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
