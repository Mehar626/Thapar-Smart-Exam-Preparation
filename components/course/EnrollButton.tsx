'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toggleCourseEnrollment } from '@/app/courses/actions'
import { Check, Plus, Loader2 } from 'lucide-react'

interface EnrollButtonProps {
  courseId: string
  initialEnrolled: boolean
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function EnrollButton({
  courseId,
  initialEnrolled,
  variant = 'outline',
  size = 'sm',
  className,
}: EnrollButtonProps) {
  const [enrolled, setEnrolled] = useState(initialEnrolled)
  const [loading, setLoading] = useState(false)

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    try {
      const res = await toggleCourseEnrollment(courseId)
      setEnrolled(res.enrolled)
    } catch (err) {
      console.error('Failed to toggle enrollment:', err)
    } finally {
      setLoading(false)
    }
  }

  if (enrolled) {
    return (
      <Button
        variant="secondary"
        size={size}
        onClick={handleToggle}
        disabled={loading}
        className={className}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
        ) : (
          <Check className="h-3.5 w-3.5 text-emerald-500 mr-1.5" />
        )}
        Enrolled
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
      ) : (
        <Plus className="h-3.5 w-3.5 mr-1.5" />
      )}
      Enroll
    </Button>
  )
}
