import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import { CalendarView } from '@/components/calendar/CalendarView'
import { CalendarDays } from 'lucide-react'
import { formatBatch } from '@/lib/utils'

interface CalendarPageProps {
  params: Promise<{ id: string }>
}

export default async function CalendarPage({ params }: CalendarPageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }

  const { id } = await params

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

  const userBatchStr = user.batch ? formatBatch(user.batch) : undefined

  // Fetch events relevant to this course and this student's batch (or course-wide events)
  let events = await prisma.calendarEvent.findMany({
    where: {
      courseId: course.id,
      OR: [
        { batchId: null }, // course-wide
        ...(user.batchId ? [{ batchId: user.batchId }] : []),
      ],
      isApproved: true,
    },
    include: {
      batch: { select: { branch: true, year: true, group: true } },
    },
    orderBy: { start: 'asc' },
  })

  // If no events in DB yet, supply realistic demo events for UCS503 prototype
  if (events.length === 0) {
    const today = new Date()
    const inFourDays = new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000)
    inFourDays.setHours(10, 0, 0, 0)

    const inTwelveDays = new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000)
    inTwelveDays.setHours(14, 0, 0, 0)

    const inThirtyDays = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    inThirtyDays.setHours(9, 30, 0, 0)

    events = [
      {
        id: 'cal-ev-mst',
        courseId: course.id,
        batchId: null,
        title: 'Mid-Semester Test (MST)',
        type: 'MST' as any,
        start: inFourDays,
        end: null,
        venue: 'LP-108 & LP-109',
        syllabusTopicIds: [
          'Unit 1: Process Framework & Agile Models',
          'Unit 2: Software Requirements & IEEE 830',
        ],
        weightage: 30,
        notes: 'Calculator allowed. Bring Institute ID card.',
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        batch: null,
      },
      {
        id: 'cal-ev-lab',
        courseId: course.id,
        batchId: user.batchId,
        title: 'Lab Evaluation 2: UML Modeling & Git Workflow',
        type: 'LAB_EVAL' as any,
        start: inTwelveDays,
        end: null,
        venue: 'Computer Science Lab 4',
        syllabusTopicIds: ['Use Case Diagrams', 'Class Diagrams', 'Git Collaboration'],
        weightage: 15,
        notes: 'Individual viva and live model submission.',
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        batch: user.batch
          ? { branch: user.batch.branch, year: user.batch.year, group: user.batch.group }
          : null,
      },
      {
        id: 'cal-ev-est',
        courseId: course.id,
        batchId: null,
        title: 'End-Semester Examination (EST)',
        type: 'EST' as any,
        start: inThirtyDays,
        end: null,
        venue: 'Central Exam Hall A',
        syllabusTopicIds: ['Comprehensive Syllabus (Units 1 - 4)'],
        weightage: 50,
        notes: 'Final semester examination.',
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        batch: null,
      },
    ]
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border/60 pb-5">
        <div className="flex items-center gap-2 text-primary font-medium text-xs mb-1">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>Batch Examination Timetable</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Academic Calendar — {course.code}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          View official Mid-Semester Tests, End-Semester exams, lab evaluations, and assignment deadlines filtered specifically for your batch.
        </p>
      </div>

      <CalendarView
        courseId={course.id}
        courseCode={course.code}
        userBatchStr={userBatchStr}
        userRole={user.role}
        events={events as any}
      />
    </div>
  )
}
