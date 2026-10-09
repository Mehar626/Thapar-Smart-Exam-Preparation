'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCheck, Loader2 } from 'lucide-react'
import { approveAllPendingAction } from '@/app/admin/actions'

interface ApproveAllButtonProps {
  pendingCount: number
}

export function ApproveAllButton({ pendingCount }: ApproveAllButtonProps) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleApproveAll() {
    if (pendingCount === 0) return
    setLoading(true)
    try {
      await approveAllPendingAction()
      setDone(true)
    } catch (e) {
      console.error('Failed to approve all:', e)
    } finally {
      setLoading(false)
    }
  }

  if (pendingCount === 0 || done) return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleApproveAll}
      disabled={loading}
      className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
      ) : (
        <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
      )}
      Approve All ({pendingCount})
    </Button>
  )
}
