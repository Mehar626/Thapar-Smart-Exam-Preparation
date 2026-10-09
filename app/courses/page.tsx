import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, GraduationCap, ArrowRight, Layers } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EnrollButton } from '@/components/course/EnrollButton'
import { shortDept } from '@/lib/utils'

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login?callbackUrl=/courses')
  }

  const [courses, userEnrollments] = await Promise.all([
    prisma.course.findMany({
      orderBy: { code: 'asc' },
    }),
    prisma.enrollment.findMany({
      where: { userId: session.user.id },
      select: { courseId: true },
    }),
  ])

  const enrolledCourseIds = new Set(userEnrollments.map((e) => e.courseId))

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8 animate-fade-in">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
            <BookOpen className="h-4 w-4" />
            <span>Academic Curriculum</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Courses Catalog</h1>
          <p className="text-muted-foreground mt-1">
            Browse TIET courses, enroll in your current semester subjects, and access PYQs and smart prep.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 text-sm bg-background">
            {courses.length} Available Courses
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold">
            {enrolledCourseIds.size} Enrolled
          </Badge>
        </div>
      </div>

      {/* ── Courses Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const isEnrolled = enrolledCourseIds.has(course.id)
          return (
            <Card
              key={course.id}
              className={`flex flex-col justify-between transition-all duration-200 hover:shadow-md border-border/70 ${
                isEnrolled ? 'ring-1 ring-primary/30 bg-primary/[0.02]' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-mono text-xs font-bold tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary dark:bg-primary/20">
                    {course.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-xs">
                      Sem {course.semester}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {shortDept(course.dept)}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg font-bold leading-snug hover:text-primary transition-colors">
                  <Link href={`/courses/${course.id}`}>{course.name}</Link>
                </CardTitle>
                <CardDescription className="text-xs line-clamp-1">
                  {course.dept}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 pb-4">
                <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-2">
                  <EnrollButton
                    courseId={course.id}
                    initialEnrolled={isEnrolled}
                  />

                  <Link
                    href={`/courses/${course.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Open Course
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
