import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  HelpCircle,
  BarChart3,
  Sparkles,
  CalendarDays,
  MessageSquare,
  FolderOpen,
  ArrowRight,
  BookOpen,
  CheckCircle,
  FileText,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CourseOverviewPageProps {
  params: Promise<{ id: string }>
}

export default async function CourseOverviewPage({ params }: CourseOverviewPageProps) {
  const { id } = await params

  const course = await prisma.course.findUnique({
    where: { id },
  })

  if (!course) {
    notFound()
  }

  // Syllabus outline for UCS503 Software Engineering (Prototype course)
  const isUCS503 = course.code === 'UCS503'

  const syllabusUnits = [
    {
      unit: 1,
      title: 'Software Processes & Lifecycle Models',
      topics: ['Generic Process Framework', 'Waterfall & Iterative Models', 'Agile Principles & Scrum', 'XP & Kanban'],
      examCoverage: 'MST & Sessional',
    },
    {
      unit: 2,
      title: 'Software Requirements Engineering',
      topics: ['Elicitation Techniques', 'SRS Documentation (IEEE 830)', 'Use Cases & User Stories', 'Requirements Validation'],
      examCoverage: 'MST Focus',
    },
    {
      unit: 3,
      title: 'Design Engineering & Architecture',
      topics: ['Architectural Design Patterns', 'Component-Level Design', 'UML Class & Sequence Diagrams', 'Design Metrics'],
      examCoverage: 'EST High Weightage',
    },
    {
      unit: 4,
      title: 'Testing Strategies & Maintenance',
      topics: ['White-box & Black-box Testing', 'Unit, Integration & System Testing', 'Regression Testing', 'Software Maintenance Models'],
      examCoverage: 'EST Focus',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Banner: Exam Prep Spotlight ── */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-accent/10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <Badge className="brand-gradient text-white border-0 text-xs">
            Course Hub
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Prepare for {course.code} with TIET Intelligence
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore past exam papers, discover historically high-yield topics, and practice with our retrieval-grounded AI tutor trained on TIET lecture slides and MST/EST question sets.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Button asChild className="brand-gradient text-white border-0 shadow-sm">
            <Link href={`/courses/${course.id}/assistant`}>
              <Sparkles className="h-4 w-4 mr-1.5" />
              Launch TIET-GPT
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/courses/${course.id}/questions`}>
              <HelpCircle className="h-4 w-4 mr-1.5" />
              View Question Bank
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Grid: Course Modules & Quick Links ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit mb-1">
              <HelpCircle className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Question Bank</CardTitle>
            <CardDescription className="text-xs">
              Past year MST, EST, Quiz, and Sessional questions filtered by topic, marks, and difficulty.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild variant="ghost" size="sm" className="p-0 text-primary hover:text-primary/80">
              <Link href={`/courses/${course.id}/questions`} className="inline-flex items-center gap-1">
                Explore PYQs
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit mb-1">
              <BarChart3 className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Topic Weightage</CardTitle>
            <CardDescription className="text-xs">
              Ranked frequency and marks share charts computed deterministically across past exam papers.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild variant="ghost" size="sm" className="p-0 text-primary hover:text-primary/80">
              <Link href={`/courses/${course.id}/weightage`} className="inline-flex items-center gap-1">
                View Weightage Charts
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit mb-1">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <CardTitle className="text-lg">AI Exam Assistant</CardTitle>
            <CardDescription className="text-xs">
              Pattern analysis, likely-question predictions, and cited Q&A strictly grounded in TIET materials.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild variant="ghost" size="sm" className="p-0 text-primary hover:text-primary/80">
              <Link href={`/courses/${course.id}/assistant`} className="inline-flex items-center gap-1">
                Open Assistant
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ── Syllabus Units Structure ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Syllabus & Exam Mapping</h3>
            <p className="text-xs text-muted-foreground">
              Official unit topics and their typical coverage across Mid-Semester (MST) and End-Semester (EST) tests.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {syllabusUnits.map((unit) => (
            <Card key={unit.unit} className="border-border/60">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-secondary text-foreground">
                    Unit {unit.unit}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {unit.examCoverage}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold mt-1">
                  {unit.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {unit.topics.map((topic, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
