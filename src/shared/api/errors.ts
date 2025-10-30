/**
 * Base API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

/**
 * Network error (no response from server)
 */
export class NetworkError extends ApiError {
  constructor(message = 'Network error occurred') {
    super(message)
    this.name = 'NetworkError'
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}

/**
 * Authentication error (401)
 */
export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}

/**
 * Authorization error (403)
 */
export class AuthorizationError extends ApiError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 403, 'AUTHORIZATION_ERROR')
    this.name = 'AuthorizationError'
    Object.setPrototypeOf(this, AuthorizationError.prototype)
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

/**
 * Validation error (422)
 */
export class ValidationError extends ApiError {
  constructor(
    message = 'Validation failed',
    public validationErrors?: Record<string, string[]>
  ) {
    super(message, 422, 'VALIDATION_ERROR', validationErrors)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

/**
 * Server error (500+)
 */
export class ServerError extends ApiError {
  constructor(message = 'An unexpected server error occurred', statusCode = 500) {
    super(message, statusCode, 'SERVER_ERROR')
    this.name = 'ServerError'
    Object.setPrototypeOf(this, ServerError.prototype)
  }
}

/**
 * Rate limit error (429)
 */
export class RateLimitError extends ApiError {
  constructor(
    message = 'Too many requests. Please try again later.',
    public retryAfter?: number
  ) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED')
    this.name = 'RateLimitError'
    Object.setPrototypeOf(this, RateLimitError.prototype)
  }
}

/**
 * Parse response to appropriate error
 */
export function createApiError(statusCode: number, data: any): ApiError {
  const message = data?.message || data?.error || 'An error occurred'

  switch (statusCode) {
    case 401:
      return new AuthenticationError(message)
    case 403:
      return new AuthorizationError(message)
    case 404:
      return new NotFoundError(message)
    case 422:
      return new ValidationError(message, data?.errors || data?.validation_errors)
    case 429:
      return new RateLimitError(message, data?.retry_after)
    case 500:
    case 502:
    case 503:
    case 504:
      return new ServerError(message, statusCode)
    default:
      return new ApiError(message, statusCode, data?.code)
  }
}
