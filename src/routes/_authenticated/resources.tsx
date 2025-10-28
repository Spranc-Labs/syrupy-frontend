import { createFileRoute } from '@tanstack/react-router'
import { Resources } from 'src/features/resources/pages/Resources'

/**
 * Resources route
 */
export const Route = createFileRoute('/_authenticated/resources')({
  component: Resources,
})
