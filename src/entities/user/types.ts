/**
 * User entity type definitions
 */
export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
  avatar_url?: string
}

export interface CreateUserInput {
  email: string
  password: string
  name?: string
}
