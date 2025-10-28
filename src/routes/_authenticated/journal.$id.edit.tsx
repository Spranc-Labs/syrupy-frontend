import { createFileRoute } from '@tanstack/react-router'
import { JournalEditor } from 'src/features/journal/pages/JournalEditor'

/**
 * Edit journal entry route
 * Path: /journal/:id/edit
 */
export const Route = createFileRoute('/_authenticated/journal/$id/edit')({
  component: JournalEditor,
})
