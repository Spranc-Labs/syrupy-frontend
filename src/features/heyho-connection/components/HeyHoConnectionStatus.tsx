import { useState } from 'react'
import type { HeyHoAccountStatus } from '@/entities/account-link'
import { useUnlinkHeyHoAccount } from '@/entities/account-link'
import { cn } from '@/shared/lib'
import { Badge, Button, Card } from '@/shared/ui'

export interface HeyHoConnectionStatusProps {
  status: HeyHoAccountStatus
  className?: string
}

export function HeyHoConnectionStatus({ status, className }: HeyHoConnectionStatusProps) {
  const [isUnlinking, setIsUnlinking] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const unlinkAccount = useUnlinkHeyHoAccount()

  const handleUnlink = async () => {
    setIsUnlinking(true)

    try {
      await unlinkAccount.mutateAsync()
      setShowConfirm(false)
    } catch (error) {
      console.error('Failed to unlink HeyHo account:', error)
    } finally {
      setIsUnlinking(false)
    }
  }

  if (!status.linked) {
    return null
  }

  const linkedDate = status.linked_at ? new Date(status.linked_at).toLocaleDateString() : 'Unknown'

  return (
    <Card className={cn('mb-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">HeyHo Browser Extension</span>
              <Badge variant="success">Connected</Badge>
            </div>
            <p className="text-sm text-base-content/60">Connected on {linkedDate}</p>
          </div>
        </div>

        {!showConfirm ? (
          <Button variant="ghost" size="sm" onClick={() => setShowConfirm(true)}>
            Disconnect
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirm(false)}
              disabled={isUnlinking}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleUnlink}
              disabled={isUnlinking}
              className="btn-error"
            >
              {isUnlinking ? 'Disconnecting...' : 'Confirm'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
