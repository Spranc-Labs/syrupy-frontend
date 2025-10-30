import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toBe('base-class active-class')
  })

  it('should filter out falsy values', () => {
    const result = cn('class1', false, 'class2', null, undefined)
    expect(result).toBe('class1 class2')
  })
})
