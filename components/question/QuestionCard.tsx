'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MathRenderer } from '@/components/math/MathRenderer'
import { SolutionView } from '@/components/question/SolutionView'
import { MessageSquare, ChevronDown, ChevronUp, BookOpen, Tag } from 'lucide-react'

interface QuestionCardProps {
  courseId: string
  question: {
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
}

export function QuestionCard({ courseId, question }: QuestionCardProps) {
  const [showSolutions, setShowSolutions] = useState(false)

  const diffVariant =
    question.difficulty === 'HARD'
      ? 'destructive'
      : question.difficulty === 'EASY'
      ? 'default'
      : 'secondary'

  return (
    <Card className="border-border/70 hover:shadow-sm transition-shadow">
      <CardHeader className="pb-3 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-foreground">
              {question.questionNumber || 'Question'}
            </span>
            <Badge variant="outline" className="text-xs font-semibold">
              {question.marks} Marks
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {question.evalType} {question.year}
            </Badge>
            <Badge variant={diffVariant} className="text-xs">
              {question.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {question.type}
            </Badge>
          </div>

          {question.sourceDocument && (
            <div className="text-xs text-muted-foreground truncate max-w-[240px]">
              {question.sourceDocument.title}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        {/* Question Text */}
        <div className="text-sm text-foreground leading-relaxed">
          <MathRenderer content={question.text} />
        </div>

        {/* Topic Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <Tag className="h-3.5 w-3.5 text-muted-foreground mr-1" />
          {question.topicTags.map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Footer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSolutions((v) => !v)}
              className="text-xs h-8"
            >
              {showSolutions ? (
                <ChevronUp className="h-3.5 w-3.5 mr-1" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 mr-1" />
              )}
              {showSolutions ? 'Hide Solutions' : `View Solutions (${question.solutions.length})`}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-xs h-8 text-muted-foreground hover:text-foreground">
              <Link href={`/courses/${courseId}/discuss?q=${question.id}`}>
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                Discuss Question
              </Link>
            </Button>
          </div>
        </div>

        {/* Expandable Solutions */}
        {showSolutions && (
          <SolutionView
            questionId={question.id}
            courseId={courseId}
            solutions={question.solutions}
          />
        )}
      </CardContent>
    </Card>
  )
}
