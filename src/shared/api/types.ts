/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
  // Auth-specific fields
  user?: any
  access_token?: string
  refresh_token?: string
}

/**
 * Request configuration
 */
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  params?: Record<string, string | number | boolean | undefined>
  /**
   * Skip automatic token refresh on 401
   */
  skipTokenRefresh?: boolean
  /**
   * Number of retry attempts
   * @default 0
   */
  retries?: number
  /**
   * Timeout in milliseconds
   * @default 30000
   */
  timeout?: number
}

/**
 * Request interceptor function
 */
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>

/**
 * Response interceptor function
 */
export type ResponseInterceptor<T = any> = (
  response: ApiResponse<T>
) => ApiResponse<T> | Promise<ApiResponse<T>>

/**
 * Error interceptor function
 */
export type ErrorInterceptor = (error: Error) => Error | Promise<Error>
