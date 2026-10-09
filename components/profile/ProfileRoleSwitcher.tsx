'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, ArrowRight } from 'lucide-react'

const DEMO_ACCOUNTS = [
  { email: 'student@thapar.edu', role: 'Student', desc: 'Practices, views calendar, chats with AI' },
  { email: 'contributor@thapar.edu', role: 'Contributor', desc: 'Uploads PYQs, slides & solutions' },
  { email: 'moderator@thapar.edu', role: 'Moderator', desc: 'Reviews & approves uploads, moderates forum' },
  { email: 'cr@thapar.edu', role: 'Class Rep (CR)', desc: 'Manages batch calendar & creates exams' },
]

interface ProfileRoleSwitcherProps {
  currentEmail: string
}

export function ProfileRoleSwitcher({ currentEmail }: ProfileRoleSwitcherProps) {
  const [switching, setSwitching] = useState<string | null>(null)

  async function handleSwitch(email: string) {
    setSwitching(email)
    await signIn('credentials', {
      email,
      password: 'demo123',
      callbackUrl: '/dashboard',
    })
  }

  return (
    <div className="space-y-3">
      {DEMO_ACCOUNTS.map((acc) => {
        const isCurrent = acc.email === currentEmail
        const isLoading = switching === acc.email

        return (
          <div
            key={acc.email}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
              isCurrent
                ? 'border-primary/50 bg-primary/5 dark:bg-primary/10'
                : 'border-border/60 hover:bg-secondary/50'
            }`}
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{acc.role}</span>
                <span className="font-mono text-xs text-muted-foreground">{acc.email}</span>
                {isCurrent && (
                  <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4">
                    Active
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{acc.desc}</p>
            </div>

            <Button
              size="sm"
              variant={isCurrent ? 'secondary' : 'outline'}
              disabled={isCurrent || isLoading}
              onClick={() => handleSwitch(acc.email)}
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isCurrent ? (
                'Current'
              ) : (
                <>
                  Switch
                  <ArrowRight className="h-3 w-3 ml-1" />
                </>
              )}
            </Button>
          </div>
        )
      })}
    </div>
  )
}
