import { createFileRoute, Navigate } from '@tanstack/react-router'
import { Bookmarks } from '@/features/bookmarks/ui/Bookmarks'
import { HoarderTabs } from '@/features/bookmarks/ui/HoarderTabs'

export const Route = createFileRoute('/_authenticated/bookmarks/$category')({
  component: RouteComponent,
})

function RouteComponent() {
  const { category } = Route.useParams()

  // Route to appropriate component based on category
  switch (category) {
    case 'hoarder-tabs':
      return <HoarderTabs />
    case 'reading-list':
      return <Bookmarks collection="Reading List" collectionRoute="/bookmarks/reading-list" />
    default:
      // Redirect to bookmarks index for unknown categories
      return <Navigate to="/bookmarks" replace />
  }
}
