import { createFileRoute, Navigate } from '@tanstack/react-router'
import { HoarderTabs } from '@/features/resource-library/ui/HoarderTabs'
import { Resources } from '@/features/resource-library/ui/Resources'

export const Route = createFileRoute('/_authenticated/resources/$category')({
  component: RouteComponent,
})

function RouteComponent() {
  const { category } = Route.useParams()

  // Route to appropriate component based on category
  switch (category) {
    case 'hoarder-tabs':
      return <HoarderTabs />
    case 'reading-list':
      return <Resources />
    default:
      // Redirect to resources index for unknown categories
      return <Navigate to="/resources" replace />
  }
}
