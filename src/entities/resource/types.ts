import type { Tag } from '../tag/types'

export interface Resource {
  id: number
  url: string
  title?: string
  status: 'pending' | 'processed' | 'failed'
  domain?: string
  has_content: boolean
  created_at: string
  updated_at: string
  tags?: Tag[]
}

export interface CreateResourceInput {
  url: string
  title?: string
}

export interface UpdateResourceInput {
  url?: string
  title?: string
  status?: Resource['status']
}

export interface ResourcesResponse {
  items?: Resource[]
  total?: number
}
