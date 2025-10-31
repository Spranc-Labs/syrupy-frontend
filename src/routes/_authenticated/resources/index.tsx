import { createFileRoute } from '@tanstack/react-router'
import { Resources } from '@/features/resource-library/ui/Resources'

/**
 * Resources route
 */
export const Route = createFileRoute('/_authenticated/resources/')({
  component: Resources,
})
