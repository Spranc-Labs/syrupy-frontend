import { type RefObject, useEffect, useState } from 'react'

interface Position {
  top: number
  left: number
}

export function useActionMenuPosition(
  ref: RefObject<HTMLElement>,
  enabled: boolean,
  dependencies: unknown[] = []
) {
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 })

  useEffect(() => {
    if (enabled) {
      const updatePosition = () => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect()
          setPosition({
            top: rect.top + rect.height / 2,
            left: rect.left,
          })
        }
      }

      // Initial position
      requestAnimationFrame(updatePosition)

      // Also update on any layout changes
      const rafId = requestAnimationFrame(() => {
        requestAnimationFrame(updatePosition)
      })

      return () => cancelAnimationFrame(rafId)
    }

    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, enabled, ...dependencies])

  return position
}
