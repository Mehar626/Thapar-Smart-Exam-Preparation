'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Pin, Lock, MessageSquare, Eye, CheckCircle2, HelpCircle } from 'lucide-react'

interface ThreadCardProps {
  courseId: string
  thread: {
    id: string
    title: string
    content: string
    tags: string[]
    isPinned: boolean
    isLocked: boolean
    acceptedPostId?: string | null
    views: number
    createdAt: string | Date
    author: {
      name: string
      role: string
    }
    question?: {
      questionNumber: string | null
      evalType: string
      year: number
    } | null
    _count: {
      posts: number
    }
  }
}

export function ThreadCard({ courseId, thread }: ThreadCardProps) {
  return (
    <Card className="border-border/70 hover:shadow-sm transition-all hover:border-primary/40">
      <CardContent className="p-4 sm:p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {thread.isPinned && (
                <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] font-bold">
                  <Pin className="h-3 w-3 mr-1 rotate-45" />
                  Pinned
                </Badge>
              )}
              {thread.isLocked && (
                <Badge variant="outline" className="text-[10px]">
                  <Lock className="h-3 w-3 mr-1" />
                  Locked
                </Badge>
              )}
              {thread.acceptedPostId && (
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Solved
                </Badge>
              )}
              {thread.question && (
                <Badge variant="secondary" className="text-[10px] font-mono">
                  <HelpCircle className="h-3 w-3 mr-1 text-primary" />
                  {thread.question.evalType} {thread.question.year} {thread.question.questionNumber}
                </Badge>
              )}
            </div>

            <h3 className="font-bold text-base text-foreground hover:text-primary transition-colors">
              <Link href={`/courses/${courseId}/discuss/${thread.id}`}>
                {thread.title}
              </Link>
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{thread._count.posts}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span>{thread.views}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {thread.content}
        </p>

        {/* Footer info & tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span>Posted by <strong className="text-foreground">{thread.author.name}</strong></span>
            <span>•</span>
            <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {thread.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full bg-secondary text-[11px] font-medium text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
