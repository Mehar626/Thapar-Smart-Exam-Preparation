'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const DEMO_ACCOUNTS = [
  { email: 'student@thapar.edu', role: 'Student', password: 'demo123' },
  { email: 'contributor@thapar.edu', role: 'Contributor', password: 'demo123' },
  { email: 'moderator@thapar.edu', role: 'Moderator', password: 'demo123' },
  { email: 'cr@thapar.edu', role: 'Class Rep', password: 'demo123' },
]

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signIn('credentials', {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
      callbackUrl,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid credentials. Make sure you use a @thapar.edu email.')
    } else if (result?.url) {
      router.push(result.url)
      router.refresh()
    }
  }

  function fillDemo(account: (typeof DEMO_ACCOUNTS)[0]) {
    setEmail(account.email)
    setPassword(account.password)
    setError(null)
  }

  return (
    <div className="w-full max-w-md space-y-4 animate-fade-in">
      {/* ── Login Card ── */}
      <Card className="shadow-xl border-border/60">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Use your <span className="font-medium text-foreground">@thapar.edu</span> email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@thapar.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              <LogIn className="h-4 w-4" />
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ── Demo Accounts ── */}
      <Card className="border-dashed border-border/60 bg-muted/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Demo Accounts
            </CardTitle>
            <Badge variant="warning">Dev Mode</Badge>
          </div>
          <CardDescription className="text-xs">
            Click any account to pre-fill the form. Password is <code className="font-mono bg-muted px-1 rounded">demo123</code> for all.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => fillDemo(account)}
              className="w-full flex items-center justify-between rounded-md border border-border/60 bg-background px-3 py-2 text-sm text-left hover:bg-secondary transition-colors"
            >
              <span className="font-mono text-xs text-muted-foreground truncate">
                {account.email}
              </span>
              <Badge variant="outline" className="ml-2 shrink-0 text-xs">
                {account.role}
              </Badge>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
