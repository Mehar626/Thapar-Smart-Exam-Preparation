import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import { PracticeSessionRunner } from '@/components/practice/PracticeSessionRunner'
import { Dumbbell } from 'lucide-react'

interface PracticePageProps {
  params: Promise<{ id: string }>
}

export default async function PracticePage({ params }: PracticePageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }

  const { id } = await params

  const course = await prisma.course.findUnique({
    where: { id },
  })

  if (!course) {
    notFound()
  }

  const isModerator = session.user.role === 'MODERATOR'

  // Fetch approved questions with solutions
  const questions = await prisma.question.findMany({
    where: {
      courseId: course.id,
      ...(isModerator ? {} : { isApproved: true }),
    },
    include: {
      solutions: {
        include: {
          author: { select: { name: true } },
        },
        orderBy: [{ isVerified: 'desc' }, { upvotes: 'desc' }],
      },
    },
    orderBy: { year: 'desc' },
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border/60 pb-5">
        <div className="flex items-center gap-2 text-primary font-medium text-xs mb-1">
          <Dumbbell className="h-3.5 w-3.5" />
          <span>Interactive Practice</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Practice Mode — {course.code}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Work through real TIET questions topic-by-topic. Write your thoughts, reveal step-by-step verified solutions, and benchmark your readiness.
        </p>
      </div>

      <PracticeSessionRunner
        courseId={course.id}
        courseCode={course.code}
        questions={questions as any}
      />
    </div>
  )
}
