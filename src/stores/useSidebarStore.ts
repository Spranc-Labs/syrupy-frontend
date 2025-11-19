import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarStore {
  width: number
  isCollapsed: boolean
  isResizing: boolean
  setWidth: (width: number) => void
  setCollapsed: (collapsed: boolean) => void
  setResizing: (resizing: boolean) => void
  toggleCollapsed: () => void
}

const MIN_WIDTH = 220
const MAX_WIDTH = 600
const DEFAULT_WIDTH = 256
const COLLAPSED_WIDTH = 64
const COLLAPSE_THRESHOLD = 140

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      width: DEFAULT_WIDTH,
      isCollapsed: false,
      isResizing: false,

      setWidth: (width) => {
        // Auto-collapse when dragged below threshold
        if (width < COLLAPSE_THRESHOLD) {
          set({ width: COLLAPSED_WIDTH, isCollapsed: true })
        } else {
          // Clamp width between min and max
          const clampedWidth = Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH)
          set({ width: clampedWidth, isCollapsed: false })
        }
      },

      setCollapsed: (collapsed) => {
        set({
          isCollapsed: collapsed,
          width: collapsed ? COLLAPSED_WIDTH : DEFAULT_WIDTH,
        })
      },

      setResizing: (resizing) => set({ isResizing: resizing }),

      toggleCollapsed: () =>
        set((state) => ({
          isCollapsed: !state.isCollapsed,
          width: !state.isCollapsed ? COLLAPSED_WIDTH : DEFAULT_WIDTH,
        })),
    }),
    {
      name: 'sidebar-storage',
      partialize: (state) => ({ width: state.width, isCollapsed: state.isCollapsed }),
    }
  )
)

// Export constants for use in components
export { MIN_WIDTH, MAX_WIDTH, DEFAULT_WIDTH, COLLAPSED_WIDTH, COLLAPSE_THRESHOLD }
