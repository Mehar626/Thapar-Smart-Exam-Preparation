import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import { ThreadCard } from '@/components/forum/ThreadCard'
import { CreateThreadModal } from '@/components/forum/CreateThreadModal'
import { CourseLiveChatbox } from '@/components/forum/CourseLiveChatbox'
import { MessageSquare, Radio, Users } from 'lucide-react'

interface DiscussPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ q?: string; tag?: string }>
}

export default async function DiscussPage({ params, searchParams }: DiscussPageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }

  const { id } = await params
  const { q: questionFilter, tag: tagFilter } = await searchParams

  const [course, user] = await Promise.all([
    prisma.course.findUnique({
      where: { id },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { batch: true },
    }),
  ])

  if (!course || !user) {
    notFound()
  }

  // Fetch threads for this course
  const threads = await prisma.forumThread.findMany({
    where: {
      courseId: course.id,
      ...(questionFilter ? { questionId: questionFilter } : {}),
      ...(tagFilter ? { tags: { has: tagFilter } } : {}),
    },
    include: {
      author: { select: { name: true, role: true } },
      question: { select: { questionNumber: true, evalType: true, year: true } },
      _count: { select: { posts: true } },
    },
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-primary font-medium text-xs mb-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Peer Learning & Doubts</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Discussion Space — {course.code}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Ask doubts, discuss past-paper questions, and collaborate with students across all 3rd year COE subgroups.
          </p>
        </div>

        <CreateThreadModal
          courseId={course.id}
          questionId={questionFilter}
        />
      </div>

      {/* ── Main Layout: Threads Stream + Live Chatbox ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thread Stream (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing <strong>{threads.length}</strong> discussion threads
            </span>
            {questionFilter && (
              <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                Filtered by Linked Question
              </span>
            )}
          </div>

          {threads.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-dashed border-border/70 space-y-3">
              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-semibold">No discussions yet</p>
              <p className="text-xs text-muted-foreground">
                Be the first to ask a doubt or post a solution note!
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {threads.map((thread) => (
                <ThreadCard
                  key={thread.id}
                  courseId={course.id}
                  thread={thread as any}
                />
              ))}
            </div>
          )}
        </div>

        {/* Live Public Chatbox (1 col) */}
        <div className="space-y-4">
          <CourseLiveChatbox
            courseCode={course.code}
            currentUser={user.name.split(' ')[0]}
            userSubgroup={user.batch ? user.batch.group : '3C72'}
          />
        </div>
      </div>
    </div>
  )
}
