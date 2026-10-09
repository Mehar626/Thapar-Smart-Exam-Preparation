import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Shield, Users, BookOpen, Layers, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatBatch, ROLE_LABELS, ROLE_VARIANTS } from '@/lib/utils'
import { ProfileRoleSwitcher } from '@/components/profile/ProfileRoleSwitcher'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login?callbackUrl=/profile')
  }

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

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8 animate-fade-in">
      {/* ── Page Header ── */}
      <div className="border-b border-border/60 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight">User Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your student identity, batch association, and preview platform roles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Account Details Card ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Account Identity</CardTitle>
              <Badge variant={ROLE_VARIANTS[user.role]}>
                {ROLE_LABELS[user.role]}
              </Badge>
            </div>
            <CardDescription>
              Institute credentials verified via @thapar.edu domain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Full Name
              </span>
              <p className="font-medium text-foreground">{user.name}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Thapar Email
              </span>
              <p className="font-mono text-sm text-foreground">{user.email}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Academic Batch
              </span>
              {user.batch ? (
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="font-mono text-xs">
                    {formatBatch(user.batch)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ({user.batch.branch}, Year {user.batch.year}, Group {user.batch.group})
                  </span>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">None assigned (Faculty/Moderator)</p>
              )}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border/50">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Enrolled Subjects ({user.enrollments.length})
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {user.enrollments.length > 0 ? (
                  user.enrollments.map((e) => (
                    <Link
                      key={e.courseId}
                      href={`/courses/${e.courseId}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary text-xs font-medium hover:bg-secondary/80 transition-colors"
                    >
                      <span className="font-mono font-bold text-primary">{e.course.code}</span>
                      <span className="text-muted-foreground">• {e.course.name}</span>
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No subjects enrolled yet.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Demo Role Switcher Card ── */}
        <Card className="border-border/70 bg-card/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Demo Role Switcher</CardTitle>
              <Badge variant="warning">Dev Mode</Badge>
            </div>
            <CardDescription>
              Instantly toggle accounts to test Student, Contributor, and Moderator access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileRoleSwitcher currentEmail={user.email} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
