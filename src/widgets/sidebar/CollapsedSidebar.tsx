import { useSidebarStore } from '@/stores/useSidebarStore'

export function CollapsedSidebar() {
  const { toggleCollapsed, width } = useSidebarStore()

  return (
    <aside
      className="fixed left-0 top-0 z-30 flex h-screen flex-col items-center py-4 transition-all duration-300"
      style={{ width: `${width}px` }}
    >
      {/* Hamburger Button */}
      <button
        type="button"
        onClick={toggleCollapsed}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label="Expand sidebar"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-label="Menu icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </aside>
  )
}
