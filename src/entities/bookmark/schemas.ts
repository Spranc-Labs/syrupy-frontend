import { z } from 'zod'

/**
 * Zod schema for creating a new bookmark
 */
export const createBookmarkSchema = z.object({
  url: z.string().url({ message: 'Must be a valid URL' }),
  title: z.string().optional(),
  description: z.string().optional(),
  collection_id: z.number().optional(),
  preview_image: z.string().optional(),
  preview_site_name: z.string().optional(),
  preview_description: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  tag_names: z.array(z.string()).optional(),
})

/**
 * Zod schema for updating an existing bookmark
 */
export const updateBookmarkSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  collection_id: z.number().optional(),
  preview_image: z.string().optional(),
  preview_site_name: z.string().optional(),
  preview_description: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  tag_names: z.array(z.string()).optional(),
})

/**
 * Zod schema for bookmark edit form (EditPanel)
 * Combines fields from bookmark + additional form state
 */
export const bookmarkFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  note: z.string().optional(),
  collection: z.string(),
  tags: z.array(z.string()),
  url: z.string().url({ message: 'Must be a valid URL' }).or(z.literal('')),
  isFavorite: z.boolean(),
})

/**
 * Type inference from schemas
 */
export type CreateBookmarkFormData = z.infer<typeof createBookmarkSchema>
export type UpdateBookmarkFormData = z.infer<typeof updateBookmarkSchema>
export type BookmarkFormData = z.infer<typeof bookmarkFormSchema>
