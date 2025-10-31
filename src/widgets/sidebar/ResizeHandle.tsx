import { useEffect, useRef } from 'react'
import { useSidebarStore } from '@/stores/useSidebarStore'

export function ResizeHandle() {
  const { setWidth, setResizing, isCollapsed } = useSidebarStore()
  const handleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = handleRef.current
    if (!handle) return

    let startX = 0
    let startWidth = 0

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      startX = e.clientX
      startWidth = useSidebarStore.getState().width
      setResizing(true)

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const newWidth = startWidth + deltaX
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      setResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''

      // Manually save final width to localStorage
      const finalState = useSidebarStore.getState()
      localStorage.setItem(
        'sidebar-storage',
        JSON.stringify({
          state: { width: finalState.width, isCollapsed: finalState.isCollapsed },
          version: 0,
        })
      )
    }

    handle.addEventListener('mousedown', handleMouseDown)

    return () => {
      handle.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [setWidth, setResizing])

  if (isCollapsed) return null

  return (
    <div
      ref={handleRef}
      className="group absolute -right-4 top-0 z-40 h-full w-8 cursor-col-resize"
      title="Resize sidebar"
    >
      {/* Visual indicator - line that appears on hover */}
      <div className="absolute right-4 top-0 h-full w-1 bg-transparent transition-colors group-hover:bg-indigo-500 group-active:bg-indigo-600" />
    </div>
  )
}
