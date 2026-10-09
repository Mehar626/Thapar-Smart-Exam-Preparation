'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  Moon,
  Sun,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ROLE_LABELS } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Role } from '@prisma/client'

interface NavLink {
  href: string
  label: string
  icon: React.ReactNode
  roles?: Role[] // undefined = visible to all
}

const NAV_LINKS: NavLink[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: '/courses',
    label: 'Courses',
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    href: '/admin',
    label: 'Admin',
    icon: <ShieldCheck className="h-4 w-4" />,
    roles: ['MODERATOR'],
  },
]

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const role = session?.user?.role as Role | undefined
  const initials = session?.user?.name
    ? session.user.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?'

  const visibleLinks = NAV_LINKS.filter(
    (link) => !link.roles || (role && link.roles.includes(role))
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 glass">
      <div className="container mx-auto flex h-14 max-w-7xl items-center px-4">
        {/* ── Logo ── */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-lg mr-6 group"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient shadow-sm group-hover:opacity-90 transition-opacity">
            <GraduationCap className="h-5 w-5 text-white" />
          </span>
          <span className="hidden sm:inline">
            <span className="text-primary dark:text-primary">TIET</span>
            <span className="text-accent font-extrabold">Prep</span>
          </span>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {visibleLinks.map((link) => {
            const isActive =
              link.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* ── Right Controls ── */}
        <div className="ml-auto flex items-center gap-2">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* User menu */}
          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">
                    {session.user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                    <Badge variant="outline" className="mt-1 w-fit text-xs">
                      {role ? ROLE_LABELS[role] : ''}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* ── Mobile Nav ── */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border/60 px-4 py-3 flex flex-col gap-1 bg-background/95 backdrop-blur">
          {visibleLinks.map((link) => {
            const isActive =
              link.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
