import type { Metadata } from 'next'
import { GraduationCap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-12">
      {/* Brand mark */}
      <div className="flex items-center gap-2 mb-8">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl brand-gradient shadow-lg">
          <GraduationCap className="h-6 w-6 text-white" />
        </span>
        <span className="text-2xl font-bold">
          <span className="text-primary">TIET</span>
          <span className="text-accent font-extrabold">Prep</span>
        </span>
      </div>

      {children}

      <p className="mt-8 text-xs text-muted-foreground text-center max-w-sm">
        Student-run platform · Not affiliated with or endorsed by Thapar Institute of Engineering
        &amp; Technology
      </p>
    </div>
  )
}
