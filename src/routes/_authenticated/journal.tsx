import { createFileRoute } from '@tanstack/react-router'
import { JournalEntries } from 'src/features/journal/pages/JournalEntries'

/**
 * Journal list route
 */
export const Route = createFileRoute('/_authenticated/journal')({
  component: JournalEntries,
})
