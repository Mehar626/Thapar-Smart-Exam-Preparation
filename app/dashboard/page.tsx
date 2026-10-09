import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  CalendarDays,
  Sparkles,
  BarChart3,
  HelpCircle,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getGreeting, formatBatch, shortDept, ROLE_LABELS, ROLE_VARIANTS } from '@/lib/utils'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard')
  }

  // Fetch user profile with batch and enrolled courses
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      batch: true,
      enrollments: {
        include: {
          course: true,
        },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  const enrolledCourses = user.enrollments.map((e) => e.course)
  const greeting = getGreeting()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8 animate-fade-in">
      {/* ── Welcome Banner ── */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card to-secondary/30 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-primary">
                {greeting},
              </span>
              <Badge variant={ROLE_VARIANTS[user.role]} className="text-xs">
                {ROLE_LABELS[user.role]}
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {user.name}
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              {user.batch ? (
                <>
                  <Users className="h-4 w-4 text-primary" />
                  <span>
                    Batch:{' '}
                    <strong className="text-foreground">
                      {formatBatch(user.batch)}
                    </strong>{' '}
                    ({user.batch.branch}, Year {user.batch.year}, Group {user.batch.group})
                  </span>
                </>
              ) : (
                <span>No academic batch assigned</span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline">
              <Link href="/courses">
                <BookOpen className="h-4 w-4 mr-1.5" />
                Browse Catalog
              </Link>
            </Button>
            {enrolledCourses.length > 0 && (
              <Button asChild className="brand-gradient text-white border-0 shadow-sm">
                <Link href={`/courses/${enrolledCourses[0].id}/assistant`}>
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  TIET-GPT Assistant
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Upcoming MST Exam Alert (Prototype Spotlight for UCS503) ── */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-foreground">Upcoming: Mid-Semester Test (MST)</span>
              <Badge variant="warning" className="text-xs">In 4 Days</Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              <strong>UCS503: Software Engineering</strong> • Oct 14, 2026 • Venue: LP-108 • Syllabus: Units 1 & 2 (Processes, Agile, Requirements)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          {enrolledCourses.find((c) => c.code === 'UCS503') ? (
            <Button asChild size="sm" className="w-full md:w-auto">
              <Link href={`/courses/${enrolledCourses.find((c) => c.code === 'UCS503')?.id}/assistant`}>
                <Sparkles className="h-4 w-4 mr-1.5" />
                Prepare with AI
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm" className="w-full md:w-auto">
              <Link href="/courses">Enroll to Prepare</Link>
            </Button>
          )}
        </div>
      </div>

      {/* ── My Enrolled Courses Section ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">My Enrolled Courses</h2>
            <p className="text-xs text-muted-foreground">
              Direct access to Question Banks, historical topic weightages, and AI tutors.
            </p>
          </div>
          <Link
            href="/courses"
            className="text-xs font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1"
          >
            Manage Courses
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {enrolledCourses.length === 0 ? (
          <Card className="border-dashed p-8 text-center space-y-3">
            <GraduationCap className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="text-base font-semibold">No courses enrolled yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Enroll in your current semester subjects from the course catalog to start practising past papers.
            </p>
            <Button asChild size="sm" className="mt-2">
              <Link href="/courses">Browse Catalog</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {course.code}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Sem {course.semester} • {shortDept(course.dept)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold mt-1">
                    <Link href={`/courses/${course.id}`} className="hover:text-primary transition-colors">
                      {course.name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-1">
                    {course.dept}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                  {/* Quick Feature Links */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-border/60 text-center">
                    <Link
                      href={`/courses/${course.id}/questions`}
                      className="p-2 rounded-lg bg-secondary/60 hover:bg-secondary text-xs font-medium transition-colors flex flex-col items-center gap-1"
                    >
                      <HelpCircle className="h-4 w-4 text-primary" />
                      <span>PYQs</span>
                    </Link>
                    <Link
                      href={`/courses/${course.id}/weightage`}
                      className="p-2 rounded-lg bg-secondary/60 hover:bg-secondary text-xs font-medium transition-colors flex flex-col items-center gap-1"
                    >
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span>Weightage</span>
                    </Link>
                    <Link
                      href={`/courses/${course.id}/assistant`}
                      className="p-2 rounded-lg bg-secondary/60 hover:bg-secondary text-xs font-medium transition-colors flex flex-col items-center gap-1"
                    >
                      <Sparkles className="h-4 w-4 text-accent" />
                      <span>AI Prep</span>
                    </Link>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/courses/${course.id}`}>
                      View Course Hub
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
