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

      // Construct authorization URL using browser-accessible HeyHo API URL
      const heyhoApiUrl = import.meta.env.VITE_SYNC_API_URL || 'http://localhost:3001'
      const authorizeUrl = new URL(`${heyhoApiUrl}/api/v1/oauth/authorize`)
      authorizeUrl.searchParams.set('client_id', result.client_id)
      authorizeUrl.searchParams.set('redirect_uri', result.redirect_uri)
      authorizeUrl.searchParams.set('scope', 'browsing_data:read')

      // Check if user needs to login to HeyHo first
      // Open HeyHo in a new tab so they can login if needed
      const heyhoLoginUrl = `${heyhoApiUrl}/login?redirect_to=${encodeURIComponent(authorizeUrl.toString())}`

      // Open HeyHo authorization in popup window
      const width = 600
      const height = 700
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
      alert('Failed to connect to HeyHo. Please make sure HeyHo is running and try again.')
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
          <strong>Note:</strong> Make sure you're logged into HeyHo first.{' '}
          <a
            href={import.meta.env.VITE_SYNC_API_URL || 'http://localhost:3001'}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80"
          >
            Open HeyHo
          </a>
        </div>
      </div>
    </Alert>
  )
}
