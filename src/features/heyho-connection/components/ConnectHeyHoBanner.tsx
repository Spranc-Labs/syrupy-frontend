import { useState } from 'react'
import { useInitiateHeyHoLink } from '@/entities/account-link'
import { cn } from '@/shared/lib'
import { Alert, Button } from '@/shared/ui'

export interface ConnectHeyHoBannerProps {
  className?: string
}

export function ConnectHeyHoBanner({ className }: ConnectHeyHoBannerProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const initiateLink = useInitiateHeyHoLink()

  const handleConnect = async () => {
    setIsConnecting(true)

    try {
      const result = await initiateLink.mutateAsync()

      // Construct our own authorization page URL
      const authorizeUrl = new URL('/auth/heyho/authorize', window.location.origin)
      authorizeUrl.searchParams.set('client_id', result.client_id)
      authorizeUrl.searchParams.set('redirect_uri', result.redirect_uri)
      authorizeUrl.searchParams.set('scope', 'browsing_data:read')

      // Open authorization page in popup window
      const width = 500
      const height = 650
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2

      const popup = window.open(
        authorizeUrl.toString(),
        'HeyHo Authorization',
        `width=${width},height=${height},left=${left},top=${top}`
      )

      if (!popup) {
        alert('Please allow popups for this site to connect your HeyHo account.')
        setIsConnecting(false)
        return
      }

      // Poll for popup close or message
      const pollTimer = setInterval(() => {
        if (popup?.closed) {
          clearInterval(pollTimer)
          setIsConnecting(false)
        }
      }, 500)
    } catch (error) {
      console.error('Failed to initiate HeyHo connection:', error)
      alert('Failed to connect to HeyHo. Please try again.')
      setIsConnecting(false)
    }
  }

  return (
    <Alert variant="info" className={cn('mb-6', className)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold mb-1">Connect Your HeyHo Browser Extension</h3>
            <p className="text-sm opacity-90">
              Link your HeyHo account to see browsing insights and discover connections between your
              research and saved resources.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleConnect}
            disabled={isConnecting}
            className="whitespace-nowrap"
          >
            {isConnecting ? 'Connecting...' : 'Connect HeyHo'}
          </Button>
        </div>
        <div className="text-sm opacity-75 pt-2 border-t border-current/20">
          <strong>Note:</strong> You'll need your HeyHo email and password to authorize the
          connection.
        </div>
      </div>
    </Alert>
  )
}
