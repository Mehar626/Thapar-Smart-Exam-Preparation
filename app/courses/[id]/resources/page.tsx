import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { FileText, Layers, CheckCircle2, Clock, AlertCircle, Upload, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ResourcesPageProps {
  params: Promise<{ id: string }>
}

export default async function ResourcesPage({ params }: ResourcesPageProps) {
  const { id } = await params

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      documents: {
        include: {
          uploader: { select: { name: true, role: true } },
          _count: { select: { questions: true, slideChunks: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!course) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Live & Embedded
          </Badge>
        )
      case 'NEEDS_REVIEW':
        return (
          <Badge variant="warning" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Needs Review
          </Badge>
        )
      case 'PARSING':
        return (
          <Badge variant="secondary" className="text-xs">
            Parsing / OCR
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Queued
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ingested Course Materials</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Parsed lecture slides and past exam papers powering the Question Bank and TIET-GPT assistant.
          </p>
        </div>
      </div>

      {/* ── Document List ── */}
      {course.documents.length === 0 ? (
        <Card className="border-dashed p-10 text-center space-y-3">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-semibold">No materials ingested yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Run the ingestion script to process slides and PYQs from <code className="bg-muted px-1 rounded">seed-data/{course.code}/</code>.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.documents.map((doc) => (
            <Card key={doc.id} className="border-border/70 hover:shadow-sm transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="font-mono text-xs">
                      {doc.type}
                    </Badge>
                    {doc.evalType && (
                      <Badge variant="secondary" className="text-xs">
                        {doc.evalType}
                      </Badge>
                    )}
                    {doc.year && (
                      <Badge variant="outline" className="text-xs">
                        {doc.year}
                      </Badge>
                    )}
                  </div>
                  {getStatusBadge(doc.status)}
                </div>

                <CardTitle className="text-base font-bold mt-2">
                  {doc.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  Uploaded by {doc.uploader.name} ({doc.uploader.role})
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 text-xs text-muted-foreground border-t border-border/50 pt-3">
                <div className="flex items-center justify-between">
                  <span>
                    {doc.type === 'PYQ'
                      ? `${doc._count.questions} questions extracted`
                      : `${doc._count.slideChunks} slide chunks indexed`}
                  </span>
                  <span className="text-[11px]">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
