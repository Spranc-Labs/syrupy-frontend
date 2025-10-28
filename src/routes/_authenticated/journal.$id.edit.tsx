import { createFileRoute } from '@tanstack/react-router'
import { JournalEditor } from '@/features/journal-writing/ui/JournalEditor'

/**
 * Edit journal entry route
 * Path: /journal/:id/edit
 */
export const Route = createFileRoute('/_authenticated/journal/$id/edit')({
  component: JournalEditor,
})
