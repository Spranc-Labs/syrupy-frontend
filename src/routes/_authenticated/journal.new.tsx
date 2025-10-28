import { createFileRoute } from '@tanstack/react-router'
import { JournalEditor } from 'src/features/journal/pages/JournalEditor'

/**
 * New journal entry route
 */
export const Route = createFileRoute('/_authenticated/journal/new')({
  component: JournalEditor,
})
