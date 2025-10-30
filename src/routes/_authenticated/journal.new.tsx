import { createFileRoute } from '@tanstack/react-router'
import { JournalEditor } from '@/features/journal-writing/ui/JournalEditor'

/**
 * New journal entry route
 */
export const Route = createFileRoute('/_authenticated/journal/new')({
  component: JournalEditor,
})
