import { type RefObject, useEffect } from 'react'

export function useAutoResizeTextarea(
  ref: RefObject<HTMLTextAreaElement>,
  _value: string,
  enabled = true
) {
  useEffect(() => {
    if (ref.current && enabled) {
      // Reset height to get accurate scrollHeight
      ref.current.style.height = '0px'
      const scrollHeight = ref.current.scrollHeight
      ref.current.style.height = `${scrollHeight}px`
    }
  }, [ref, enabled])
}
