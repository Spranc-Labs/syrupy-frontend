import { ApiError, AuthenticationError, createApiError, NetworkError } from './errors'
import { tokenStorage } from './token-storage'
import type { ApiResponse, RequestConfig } from './types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
const IS_DEV = import.meta.env.DEV

/**
 * Enhanced API Client with TypeScript generics, error handling, and retry logic
 */
class ApiClient {
  private isRefreshing = false
  private refreshPromise: Promise<string | null> | null = null

  /**
   * Make an API request with full type safety
   */
  async request<T = unknown>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers: customHeaders = {},
      body,
      params,
      skipTokenRefresh = false,
      retries = 0,
      timeout = 30000,
    } = config

    // Build URL with query params
    const url = new URL(`${API_BASE_URL}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    // Prepare headers
    const accessToken = tokenStorage.getAccessToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    // Log request in development
    if (IS_DEV) {
      console.log(`[API] ${method} ${url.pathname}`, {
        params,
        body,
        headers: { ...headers, Authorization: headers.Authorization ? '[REDACTED]' : undefined },
      })
    }

    try {
      // Make the request with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      let response: Response
      try {
        response = await fetch(url.toString(), {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        })
      } finally {
        clearTimeout(timeoutId)
      }

      // Handle token refresh on 401
      if (response.status === 401 && !skipTokenRefresh && tokenStorage.getRefreshToken()) {
        const newAccessToken = await this.refreshAccessToken()

        if (newAccessToken) {
          // Retry with new token
          headers.Authorization = `Bearer ${newAccessToken}`
          response = await fetch(url.toString(), {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
          })
        } else {
          // Refresh failed - redirect to login
          this.handleAuthFailure()
          throw new AuthenticationError('Session expired. Please log in again.')
        }
      }

      // Parse response
      const data: ApiResponse<T> = await response.json()

      // Log response in development
      if (IS_DEV) {
        console.log(`[API] ${method} ${url.pathname} - ${response.status}`, data)
      }

      // Handle error responses
      if (!response.ok) {
        throw createApiError(response.status, data)
      }

      return data
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        if (IS_DEV) {
        }
        throw new NetworkError(
          'Unable to connect to the server. Please check your internet connection.'
        )
      }

      // Handle abort (timeout)
      if (error instanceof DOMException && error.name === 'AbortError') {
        if (IS_DEV) {
        }
        throw new NetworkError('Request timed out. Please try again.')
      }

      // If it's already an ApiError, rethrow it
      if (error instanceof ApiError) {
        throw error
      }

      // Retry logic
      if (retries > 0) {
        if (IS_DEV) {
          console.log(`[API] Retrying ${method} ${url.pathname} (${retries} attempts left)`)
        }
        await this.delay(1000) // Wait 1s before retry
        return this.request<T>(endpoint, { ...config, retries: retries - 1 })
      }

      // Unknown error
      if (IS_DEV) {
      }
      throw new ApiError(error instanceof Error ? error.message : 'An unexpected error occurred')
    }
  }

  /**
   * Refresh access token
   */
  private async refreshAccessToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh attempts
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this.performRefresh()

    try {
      const result = await this.refreshPromise
      return result
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  /**
   * Perform token refresh
   */
  private async performRefresh(): Promise<string | null> {
    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) return null

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      const data: ApiResponse = await response.json()

      if (data.success && data.access_token) {
        tokenStorage.setTokens(data.access_token, refreshToken)
        return data.access_token
      }

      // Refresh failed
      tokenStorage.clearTokens()
      return null
    } catch (_error) {
      if (IS_DEV) {
      }
      tokenStorage.clearTokens()
      return null
    }
  }

  /**
   * Handle authentication failure
   */
  private handleAuthFailure(): void {
    tokenStorage.clearTokens()
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login'
    }
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Convenience method: GET
   */
  async get<T = unknown>(
    endpoint: string,
    config: Omit<RequestConfig, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  /**
   * Convenience method: POST
   */
  async post<T = unknown>(
    endpoint: string,
    body?: any,
    config: Omit<RequestConfig, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body })
  }

  /**
   * Convenience method: PUT
   */
  async put<T = unknown>(
    endpoint: string,
    body?: any,
    config: Omit<RequestConfig, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body })
  }

  /**
   * Convenience method: PATCH
   */
  async patch<T = unknown>(
    endpoint: string,
    body?: any,
    config: Omit<RequestConfig, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body })
  }

  /**
   * Convenience method: DELETE
   */
  async delete<T = unknown>(
    endpoint: string,
    config: Omit<RequestConfig, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
