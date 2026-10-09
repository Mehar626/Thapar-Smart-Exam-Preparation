import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import {
  computeDeterministicPatternStats,
  computePatternChangeShifts,
  computeLikelyTopicPredictions,
} from '@/lib/analytics/pattern'
import { PatternAnalysisView } from '@/components/assistant/PatternAnalysisView'
import { ChangeDetectionView } from '@/components/assistant/ChangeDetectionView'
import { LikelyPredictionsView } from '@/components/assistant/LikelyPredictionsView'
import { StudyPlanView } from '@/components/assistant/StudyPlanView'
import { AssistantChat } from '@/components/assistant/AssistantChat'
import { PrepReportExport } from '@/components/assistant/PrepReportExport'
import { Sparkles, BarChart2, RefreshCw, Trophy, CalendarDays, MessageSquare } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

interface AssistantPageProps {
  params: Promise<{ id: string }>
}

export default async function AssistantPage({ params }: AssistantPageProps) {
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

  // Compute deterministic pattern analytics
  const [stats, shifts, predictions] = await Promise.all([
    computeDeterministicPatternStats(course.id, 'MST' as any),
    computePatternChangeShifts(course.id, 'MST' as any),
    computeLikelyTopicPredictions(course.id, 'MST' as any),
  ])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Headline Header ── */}
      <div className="border-b border-border/60 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md brand-gradient text-white text-xs">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="font-bold text-xs uppercase tracking-wider text-primary">
              TIET-GPT Exam Intelligence
            </span>
            <Badge variant="outline" className="text-[10px]">
              MST Target
            </Badge>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            AI Exam Prep Assistant — {course.code}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            A course-grounded intelligence engine that analyzes past exam trends, predicts high-yield topics, builds custom study schedules, and cites verified TIET slides.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <PrepReportExport
            courseCode={course.code}
            stats={stats}
            shifts={shifts}
            predictions={predictions}
          />
        </div>
      </div>

      {/* ── Main Tabbed Explorer ── */}
      <Tabs defaultValue="predictions" className="space-y-6">
        <TabsList className="bg-secondary/70 p-1 rounded-xl w-full flex overflow-x-auto justify-start border border-border/50 scrollbar-none">
          <TabsTrigger value="predictions" className="flex items-center gap-1.5 text-xs">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span>Likely Predictions</span>
          </TabsTrigger>

          <TabsTrigger value="pattern" className="flex items-center gap-1.5 text-xs">
            <BarChart2 className="h-3.5 w-3.5 text-primary" />
            <span>Pattern Analysis</span>
          </TabsTrigger>

          <TabsTrigger value="shifts" className="flex items-center gap-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5 text-emerald-500" />
            <span>Change Detection</span>
          </TabsTrigger>

          <TabsTrigger value="schedule" className="flex items-center gap-1.5 text-xs">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            <span>Study Plan</span>
          </TabsTrigger>

          <TabsTrigger value="chat" className="flex items-center gap-1.5 text-xs">
            <MessageSquare className="h-3.5 w-3.5 text-accent" />
            <span>Ask TIET-GPT</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Likely Predictions */}
        <TabsContent value="predictions" className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                High-Yield Topic Probability Ranking
              </h3>
              <p className="text-xs text-muted-foreground">
                Ranked probability estimates with verified paper evidence and recommended revision actions.
              </p>
            </div>
          </div>
          <LikelyPredictionsView predictions={predictions} />
        </TabsContent>

        {/* Tab 2: Pattern Analysis */}
        <TabsContent value="pattern" className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Historical Exam Paper Pattern Breakdown
              </h3>
              <p className="text-xs text-muted-foreground">
                Deterministic distributions of marks, question styles, and common professor command phrasing.
              </p>
            </div>
          </div>
          <PatternAnalysisView stats={stats} />
        </TabsContent>

        {/* Tab 3: Change Detection */}
        <TabsContent value="shifts" className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Pattern Change Detection & Slide Correlation
              </h3>
              <p className="text-xs text-muted-foreground">
                Tracks pedagogical shifts across newer academic sessions and correlates lecture slide depth.
              </p>
            </div>
          </div>
          <ChangeDetectionView shifts={shifts} />
        </TabsContent>

        {/* Tab 4: Study Plan */}
        <TabsContent value="schedule" className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                4-Day MST Revision Roadmap
              </h3>
              <p className="text-xs text-muted-foreground">
                Custom time allocation balanced by topic weightages leading up to your scheduled exam.
              </p>
            </div>
          </div>
          <StudyPlanView courseId={course.id} courseCode={course.code} />
        </TabsContent>

        {/* Tab 5: Grounded Chat */}
        <TabsContent value="chat" className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Cited Question-Answering with TIET-GPT
              </h3>
              <p className="text-xs text-muted-foreground">
                Ask doubts, generate custom practice questions, or clarify concepts with guaranteed citations.
              </p>
            </div>
          </div>
          <AssistantChat courseId={course.id} courseCode={course.code} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
