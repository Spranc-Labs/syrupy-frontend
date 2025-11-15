import { type RefObject, useEffect } from 'react'

export function useAutoResizeTextarea(
  ref: RefObject<HTMLTextAreaElement>,
  _value: string,
  enabled = true
) {
  useEffect(() => {
    if (!ref.current || !enabled) return

    const textarea = ref.current

    // Use requestAnimationFrame to ensure DOM has fully updated before measuring
    const resize = () => {
      if (!textarea) return

      // Store original overflow to restore later
      const originalOverflow = textarea.style.overflow

      // Hide scrollbar during resize to get accurate scrollHeight
      textarea.style.overflow = 'hidden'

      // Reset to 'auto' to allow browser to calculate natural height
      // CRITICAL: Using 'auto' instead of '0px' prevents text cutoff
      // '0px' collapses the textarea and gives inaccurate scrollHeight with box-sizing: border-box
      textarea.style.height = 'auto'

      // Get the full scroll height of the content
      // scrollHeight now accurately includes all content with proper padding/line-height
      const { scrollHeight } = textarea

      // Set the height to match content exactly
      textarea.style.height = `${scrollHeight}px`

      // Restore overflow
      textarea.style.overflow = originalOverflow
    }

    // Use RAF to ensure resize happens after DOM paint
    const rafId = requestAnimationFrame(resize)

    return () => cancelAnimationFrame(rafId)
  }, [ref, enabled])
}
