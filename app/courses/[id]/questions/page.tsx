import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import { QuestionBankExplorer } from '@/components/question/QuestionBankExplorer'
import { HelpCircle } from 'lucide-react'

interface QuestionsPageProps {
  params: Promise<{ id: string }>
}

export default async function QuestionsPage({ params }: QuestionsPageProps) {
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

  // Fetch approved questions (or all if moderator)
  const questions = await prisma.question.findMany({
    where: {
      courseId: course.id,
      ...(isModerator ? {} : { isApproved: true }),
    },
    include: {
      sourceDocument: { select: { title: true } },
      solutions: {
        include: {
          author: { select: { name: true } },
        },
        orderBy: [{ isVerified: 'desc' }, { upvotes: 'desc' }],
      },
    },
    orderBy: [{ year: 'desc' }, { marks: 'asc' }],
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="border-b border-border/60 pb-5">
        <div className="flex items-center gap-2 text-primary font-medium text-xs mb-1">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Curated TIET Past Papers</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Question Bank — {course.code}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Browse real exam questions from previous years (MST, EST, Quizzes). Every question features step-by-step solutions with mathematical rendering and community verification.
        </p>
      </div>

      <QuestionBankExplorer
        courseId={course.id}
        courseCode={course.code}
        questions={questions as any}
      />
    </div>
  )
}
