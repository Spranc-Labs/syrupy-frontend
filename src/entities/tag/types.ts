export interface Tag {
  id: number
  name: string
  color: string
  created_at?: string
  updated_at?: string
}

export interface CreateTagInput {
  name: string
  color?: string
}

export interface UpdateTagInput {
  name?: string
  color?: string
}

export interface TagsResponse {
  items?: Tag[]
  total?: number
}
