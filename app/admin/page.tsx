import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { ShieldCheck, Inbox, CheckCircle2, AlertCircle, FileText, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { QuestionReviewCard } from '@/components/admin/QuestionReviewCard'
import { ApproveAllButton } from '@/components/admin/ApproveAllButton'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'MODERATOR') {
    redirect('/dashboard')
  }

  // Fetch pending review items & overall stats
  const [pendingQuestions, approvedCount, pendingDocsCount] = await Promise.all([
    prisma.question.findMany({
      where: { isApproved: false },
      include: {
        course: { select: { code: true, name: true } },
        sourceDocument: { select: { title: true } },
        solutions: {
          select: { id: true, content: true, authorType: true, isVerified: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.question.count({
      where: { isApproved: true },
    }),
    prisma.document.count({
      where: { status: 'NEEDS_REVIEW' },
    }),
  ])

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8 animate-fade-in">
      {/* ── Admin Header ── */}
      <div className="border-b border-border/60 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-destructive font-medium text-sm mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Moderation Center</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Moderator Review Queue</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Review parsed questions, verify topic tags, and approve items to make them searchable and embedded.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ApproveAllButton pendingCount={pendingQuestions.length} />
          <Badge variant="destructive" className="px-3 py-1 text-xs">
            Role: MODERATOR
          </Badge>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Pending Review</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span>{pendingQuestions.length}</span>
              <Inbox className="h-5 w-5 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Extracted questions awaiting moderator approval
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Approved & Embedded</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span>{approvedCount}</span>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Active in pgvector Question Bank
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Papers Needing Review</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span>{pendingDocsCount}</span>
              <FileText className="h-5 w-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Parsed exam papers with queued questions
          </CardContent>
        </Card>
      </div>

      {/* ── Pending Questions Queue ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">
            Pending Questions Queue ({pendingQuestions.length})
          </h2>
        </div>

        {pendingQuestions.length === 0 ? (
          <Card className="border-dashed p-10 text-center space-y-3">
            <div className="p-3 rounded-full bg-secondary w-fit mx-auto text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold">Queue is clear!</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                All parsed questions have been approved and embedded into the course question banks.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingQuestions.map((q) => (
              <QuestionReviewCard key={q.id} question={q} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
