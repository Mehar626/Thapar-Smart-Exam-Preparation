import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { CourseTabNav } from '@/components/layout/CourseTabNav'
import { EnrollButton } from '@/components/course/EnrollButton'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft } from 'lucide-react'
import { shortDept } from '@/lib/utils'

interface CourseLayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function CourseLayout({ children, params }: CourseLayoutProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }

  const { id } = await params

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      enrollments: {
        where: { userId: session.user.id },
      },
    },
  })

  if (!course) {
    notFound()
  }

  const isEnrolled = course.enrollments.length > 0

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Course Header ── */}
      <div className="border-b border-border/60 bg-card/60 backdrop-blur">
        <div className="container mx-auto max-w-7xl px-4 py-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              All Courses
            </Link>
            <span>/</span>
            <span className="font-mono text-foreground">{course.code}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {course.code}
                </span>
                <Badge variant="outline" className="text-xs">
                  Semester {course.semester}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {shortDept(course.dept)}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {course.name}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Department of {course.dept}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <EnrollButton
                courseId={course.id}
                initialEnrolled={isEnrolled}
                size="default"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section Navigation Tabs ── */}
      <CourseTabNav courseId={course.id} />

      {/* ── Tab Content ── */}
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8">
        {children}
      </main>
    </div>
  )
}
