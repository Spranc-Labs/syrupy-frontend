export { bookmarkKeys } from './api/keys'
export {
  useCreateBookmark,
  useDeleteBookmark,
  useMoveBookmark,
  useRestoreBookmark,
  useUpdateBookmark,
} from './api/mutations'

export { useBookmark, useBookmarks, useTrashBookmarks } from './api/queries'
export type {
  BookmarkFormData,
  CreateBookmarkFormData,
  UpdateBookmarkFormData,
} from './schemas'

export {
  bookmarkFormSchema,
  createBookmarkSchema,
  updateBookmarkSchema,
} from './schemas'
export type {
  Bookmark,
  BookmarkResponse,
  BookmarksResponse,
  CreateBookmarkInput,
  MoveBookmarkInput,
  UpdateBookmarkInput,
} from './types'
