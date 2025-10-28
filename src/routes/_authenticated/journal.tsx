import { createFileRoute } from '@tanstack/react-router'
import { JournalEntries } from '@/features/journal-writing/ui/JournalEntries'

/**
 * Journal list route
 */
export const Route = createFileRoute('/_authenticated/journal')({
  component: JournalEntries,
})
