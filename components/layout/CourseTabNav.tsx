'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid,
  HelpCircle,
  Dumbbell,
  Trophy,
  BarChart3,
  Sparkles,
  CalendarDays,
  MessageSquare,
  FolderOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Tab {
  href: string
  label: string
  icon: React.ReactNode
  badge?: string // e.g. "New"
}

const TABS: Tab[] = [
  { href: '', label: 'Overview', icon: <LayoutGrid className="h-4 w-4" /> },
  { href: '/questions', label: 'Question Bank', icon: <HelpCircle className="h-4 w-4" /> },
  { href: '/practice', label: 'Practice', icon: <Dumbbell className="h-4 w-4" /> },
  { href: '/quiz', label: 'Quiz', icon: <Trophy className="h-4 w-4" /> },
  { href: '/weightage', label: 'Weightage', icon: <BarChart3 className="h-4 w-4" /> },
  {
    href: '/assistant',
    label: 'AI Assistant',
    icon: <Sparkles className="h-4 w-4" />,
    badge: 'AI',
  },
  { href: '/calendar', label: 'Calendar', icon: <CalendarDays className="h-4 w-4" /> },
  { href: '/discuss', label: 'Discuss', icon: <MessageSquare className="h-4 w-4" /> },
  { href: '/resources', label: 'Resources', icon: <FolderOpen className="h-4 w-4" /> },
]

interface CourseTabNavProps {
  courseId: string
}

export function CourseTabNav({ courseId }: CourseTabNavProps) {
  const pathname = usePathname()
  const base = `/courses/${courseId}`

  return (
    <div className="border-b border-border/60 bg-background/95 sticky top-14 z-40 backdrop-blur">
      <div className="container mx-auto max-w-7xl px-4">
        <nav
          className="flex overflow-x-auto gap-0 scrollbar-none -mb-px"
          aria-label="Course sections"
        >
          {TABS.map((tab) => {
            const href = `${base}${tab.href}`
            const isActive =
              tab.href === ''
                ? pathname === base || pathname === `${base}/`
                : pathname.startsWith(href)

            return (
              <Link
                key={tab.href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                {tab.icon}
                {tab.label}
                {tab.badge && (
                  <span className="ml-0.5 rounded-full bg-accent/20 text-accent-foreground border border-accent/30 px-1.5 py-0.5 text-[10px] font-bold leading-none">
                    {tab.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
