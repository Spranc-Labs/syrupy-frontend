/**
 * Common utility types used across the application
 */

/**
 * Pagination metadata for API responses
 */
export interface Pagination {
  current_page: number
  per_page: number
  total: number
  total_pages?: number
}

/**
 * Date range for filtering
 */
export interface DateRange {
  start: Date
  end: Date
}

/**
 * Sort order for queries
 */
export type SortOrder = 'asc' | 'desc'

/**
 * Generic sort options
 */
export interface SortOptions<T extends string = string> {
  field: T
  order: SortOrder
}

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null

/**
 * Optional type helper (T or undefined)
 */
export type Optional<T> = T | undefined

/**
 * Make specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Make specific properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
