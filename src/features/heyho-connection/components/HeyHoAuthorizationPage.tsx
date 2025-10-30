import { useState } from 'react'
import { useCompleteHeyHoLink } from '@/entities/account-link'
import { Button, Card, Input } from '@/shared/ui'

interface HeyHoAuthorizationPageProps {
  clientId: string
  redirectUri: string
  scope: string
}

export function HeyHoAuthorizationPage({
  clientId,
  redirectUri,
  scope,
}: HeyHoAuthorizationPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const completeLink = useCompleteHeyHoLink()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Call HeyHo to get authorization code
      const heyhoApiUrl = import.meta.env.VITE_SYNC_API_URL || 'http://localhost:3001/api/v1'
      const response = await fetch(`${heyhoApiUrl}/oauth/authorize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          client_id: clientId,
          redirect_uri: redirectUri,
          scope,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error_description || 'Authorization failed')
        setIsSubmitting(false)
        return
      }

      // Exchange code for user link via Syrupy API
      await completeLink.mutateAsync({
        code: data.code,
        redirect_uri: redirectUri,
      })

      // Show success state
      setSuccess(true)

      // Notify parent window of successful authorization
      if (window.opener) {
        window.opener.postMessage({ type: 'heyho-auth-success' }, window.location.origin)
      }

      // Close popup after showing success message
      setTimeout(() => {
        window.close()
      }, 1500)
    } catch (_err) {
      setError('Failed to authorize. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 p-4">
      <Card className="w-full max-w-md">
        {success ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <svg
                className="h-8 w-8 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mb-2 font-bold text-xl">Successfully Connected!</h2>
            <p className="text-base-content/60">Your HeyHo account is now linked to Syrupy.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h1 className="mb-2 font-bold text-2xl">Authorize Syrupy</h1>
              <p className="text-base-content/60">
                Syrupy is requesting access to your HeyHo browsing data
              </p>
            </div>

            <div className="mb-6 rounded-lg bg-base-300 p-4">
              <h2 className="mb-2 font-semibold">Requested Permissions:</h2>
              <ul className="list-inside list-disc space-y-1 text-sm">
                <li>Read your browsing history</li>
                <li>View browsing insights and patterns</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your HeyHo password"
                required
              />

              {error && (
                <div className="alert alert-error">
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => window.close()}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Authorizing...' : 'Authorize'}
                </Button>
              </div>
            </form>

            <p className="mt-4 text-center text-base-content/60 text-xs">
              By authorizing, you allow Syrupy to access your HeyHo data as described above.
            </p>
          </>
        )}
      </Card>
    </div>
  )
}
