import { createFileRoute } from '@tanstack/react-router'
import { HoarderTabs } from '@/features/bookmarks/ui/HoarderTabs'

export const Route = createFileRoute('/_authenticated/bookmarks/hoarder-tabs')({
  component: HoarderTabs,
})
