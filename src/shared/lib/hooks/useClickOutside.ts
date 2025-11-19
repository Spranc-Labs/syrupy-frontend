import { type RefObject, useEffect } from 'react'

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T> | RefObject<T>[],
  handler: (event: MouseEvent) => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return undefined

    function handleClickOutside(event: MouseEvent) {
      const refs = Array.isArray(ref) ? ref : [ref]

      // Check if click is inside ANY of the refs
      const isInside = refs.some((r) => r.current?.contains(event.target as Node))

      if (!isInside) {
        handler(event)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ref, handler, enabled])
}
