import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { MathRenderer } from '@/components/math/MathRenderer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  ChevronLeft,
  Pin,
  Lock,
  CheckCircle2,
  ThumbsUp,
  Sparkles,
  HelpCircle,
  Send,
  Shield,
  Trash2,
} from 'lucide-react'
import {
  createPostAction,
  votePostAction,
  markAcceptedAnswerAction,
  moderateThreadAction,
  askAiInThreadAction,
} from '../actions'

interface ThreadViewPageProps {
  params: Promise<{ id: string; threadId: string }>
}

export default async function ThreadViewPage({ params }: ThreadViewPageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }

  const { id: courseId, threadId } = await params

  const [course, thread] = await Promise.all([
    prisma.course.findUnique({ where: { id: courseId } }),
    prisma.forumThread.findUnique({
      where: { id: threadId },
      include: {
        author: { select: { id: true, name: true, role: true } },
        question: {
          select: { id: true, text: true, questionNumber: true, evalType: true, year: true, marks: true },
        },
        posts: {
          include: {
            author: { select: { id: true, name: true, role: true } },
          },
          orderBy: [{ isAccepted: 'desc' }, { upvotes: 'desc' }, { createdAt: 'asc' }],
        },
      },
    }),
  ])

  if (!course || !thread) {
    notFound()
  }

  const isModerator = session.user.role === 'MODERATOR'
  const isAuthor = thread.authorId === session.user.id

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* ── Back to Forum ── */}
      <div>
        <Link
          href={`/courses/${courseId}/discuss`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Discussions
        </Link>
      </div>

      {/* ── Original Post Card ── */}
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="pb-3 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                {thread.isPinned && (
                  <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px]">
                    <Pin className="h-3 w-3 mr-1" />
                    Pinned
                  </Badge>
                )}
                {thread.isLocked && (
                  <Badge variant="outline" className="text-[10px]">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                )}
                {thread.tags.map((t, idx) => (
                  <Badge key={idx} variant="secondary" className="text-[10px]">
                    {t}
                  </Badge>
                ))}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1 text-foreground">
                {thread.title}
              </h1>
            </div>

            {/* Moderator Quick Actions */}
            {isModerator && (
              <div className="flex items-center gap-1.5">
                <form action={moderateThreadAction.bind(null, thread.id, 'PIN', courseId)}>
                  <Button variant="outline" size="sm" type="submit" className="text-xs h-7">
                    {thread.isPinned ? 'Unpin' : 'Pin'}
                  </Button>
                </form>
                <form action={moderateThreadAction.bind(null, thread.id, 'LOCK', courseId)}>
                  <Button variant="outline" size="sm" type="submit" className="text-xs h-7">
                    {thread.isLocked ? 'Unlock' : 'Lock'}
                  </Button>
                </form>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground pt-1 flex items-center gap-2">
            <span>Posted by <strong className="text-foreground">{thread.author.name}</strong> ({thread.author.role})</span>
            <span>•</span>
            <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pb-5">
          {/* Linked Question Context Box */}
          {thread.question && (
            <div className="p-3.5 rounded-xl border border-primary/25 bg-primary/[0.03] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-primary">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4" />
                  Linked Exam Question: {thread.question.evalType} {thread.question.year} {thread.question.questionNumber} ({thread.question.marks}M)
                </span>
                <Link
                  href={`/courses/${courseId}/questions`}
                  className="text-[11px] underline hover:text-primary/80"
                >
                  View in Bank
                </Link>
              </div>
              <p className="text-xs text-foreground/90 font-medium">
                {thread.question.text}
              </p>
            </div>
          )}

          {/* Thread Content */}
          <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
            <MathRenderer content={thread.content} />
          </div>

          {/* In-Thread "Ask AI" Trigger */}
          <div className="pt-2 border-t border-border/40 flex justify-end">
            <form action={askAiInThreadAction.bind(null, thread.id, thread.title + '\n' + thread.content, courseId)}>
              <Button type="submit" size="sm" variant="outline" className="text-xs brand-gradient text-white border-0 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Ask TIET-GPT to Answer
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* ── Replies Stream ── */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground">
          Replies ({thread.posts.length})
        </h3>

        {thread.posts.map((post) => (
          <Card
            key={post.id}
            className={`border-border/70 ${
              post.isAccepted
                ? 'border-emerald-500/40 bg-emerald-500/[0.02] ring-1 ring-emerald-500/30'
                : post.isAiGenerated
                ? 'border-accent/40 bg-accent/[0.02]'
                : ''
            }`}
          >
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  {post.isAccepted && (
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Accepted Answer
                    </Badge>
                  )}
                  {post.isAiGenerated && (
                    <Badge variant="warning" className="text-[10px]">
                      <Sparkles className="h-3 w-3 mr-1" />
                      TIET-GPT Answer (Grounded)
                    </Badge>
                  )}
                  <span className="font-bold text-xs text-foreground">
                    {post.author.name}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {post.author.role}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    • {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Vote & Accept Controls */}
                <div className="flex items-center gap-2">
                  <form action={votePostAction.bind(null, post.id, true)}>
                    <button
                      type="submit"
                      className="flex items-center gap-1 text-xs px-2 py-0.5 rounded hover:bg-secondary text-foreground"
                    >
                      <ThumbsUp className="h-3.5 w-3.5 text-primary" />
                      <span>{post.upvotes}</span>
                    </button>
                  </form>

                  {(isAuthor || isModerator) && !post.isAccepted && (
                    <form action={markAcceptedAnswerAction.bind(null, thread.id, post.id, courseId)}>
                      <Button variant="ghost" size="sm" type="submit" className="text-[11px] h-7 text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Accept
                      </Button>
                    </form>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                <MathRenderer content={post.content} />
              </div>

              {/* Citations if AI */}
              {post.isAiGenerated && Array.isArray(post.citations) && (
                <div className="pt-2 border-t border-border/40 text-[10px] text-muted-foreground space-y-1">
                  <div className="font-bold uppercase">Sources Verified:</div>
                  <div className="flex flex-wrap gap-1">
                    {post.citations.map((c: any, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-muted font-mono text-foreground">
                        {c.citation || c.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Reply Composer ── */}
      {!thread.isLocked ? (
        <Card className="border-border/70 p-4 sm:p-5">
          <form
            action={async (formData) => {
              'use server'
              const content = formData.get('content') as string
              if (content?.trim()) {
                await createPostAction({ threadId: thread.id, content, courseId })
              }
            }}
            className="space-y-3"
          >
            <label className="text-xs font-bold text-foreground">
              Write a Reply (Markdown and $math$ supported):
            </label>
            <textarea
              name="content"
              rows={3}
              placeholder="Provide an answer, point to relevant slide numbers, or clarify the doubt..."
              className="w-full text-xs p-3 rounded-md border border-border/60 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" className="brand-gradient text-white border-0 text-xs">
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Post Reply
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="p-4 rounded-xl border border-border/60 bg-muted/30 text-center text-xs text-muted-foreground">
          This thread has been locked by a moderator. No further replies can be posted.
        </div>
      )}
    </div>
  )
}
