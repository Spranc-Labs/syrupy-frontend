import { createFileRoute } from '@tanstack/react-router'
import { HeyHoAuthorizationPage } from '@/features/heyho-connection/components/HeyHoAuthorizationPage'

export const Route = createFileRoute('/auth/heyho/authorize')({
  validateSearch: (search: Record<string, unknown>) => ({
    client_id: search.client_id as string,
    redirect_uri: search.redirect_uri as string,
    scope: (search.scope as string) || 'browsing_data:read',
  }),
  component: AuthorizePage,
})

function AuthorizePage() {
  const { client_id, redirect_uri, scope } = Route.useSearch()

  return <HeyHoAuthorizationPage clientId={client_id} redirectUri={redirect_uri} scope={scope} />
}
