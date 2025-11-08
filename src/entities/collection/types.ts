export interface Collection {
  id: number
  name: string
  icon?: string
  color: string
  description?: string
  position: number
  is_default: boolean
  bookmarks_count?: number
  created_at: string
  updated_at: string
}

export interface CollectionFormData {
  name: string
  icon?: string
  color?: string
  description?: string
  position?: number
  is_default?: boolean
}

export interface CollectionsResponse {
  success: boolean
  data: Collection[]
  message?: string
}

export interface CollectionResponse {
  success: boolean
  data: Collection
  message?: string
}
