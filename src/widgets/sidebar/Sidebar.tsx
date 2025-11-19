import { useRouterState } from '@tanstack/react-router'
import { useAuth } from '@/app/providers'
import { useCollections } from '@/entities/collection'
import { cn } from '@/shared/lib'
import { useNavigationStore } from '@/stores/useNavigationStore'
import { useSidebarStore } from '@/stores/useSidebarStore'
import { CollapsedSidebar } from './CollapsedSidebar'
import { NavigationPanel } from './NavigationPanel'
import { ResizeHandle } from './ResizeHandle'
import { SidebarItem } from './SidebarItem'
import { SidebarSection } from './SidebarSection'

export function Sidebar() {
  const router = useRouterState()
  const location = router.location
  const { user } = useAuth()
  const { toggle } = useNavigationStore()
  const { width, isCollapsed, isResizing } = useSidebarStore()
  const { data: collections, isLoading: isLoadingCollections } = useCollections()

  const isActive = (path: string) => location.pathname === path
  const isBookmarksPage = location.pathname.startsWith('/bookmarks')

  // Hide sidebar completely when collapsed on any bookmark page
  if (isCollapsed && isBookmarksPage) {
    return null
  }

  // Show collapsed view when sidebar is collapsed on non-bookmark pages
  if (isCollapsed && !isBookmarksPage) {
    return <CollapsedSidebar />
  }

  const getUserDisplayName = (): string => {
    if (!user) return 'User'
    if (user.full_name) return user.full_name
    if (user.first_name) return user.first_name
    if (user.email) return user.email.split('@')[0] || 'User'
    return 'User'
  }

  // Mock data for counts (will be dynamic later)
  const counts = {
    all: 30,
    unsorted: 8,
    hoarderTabs: 10,
    pinned: 20,
    serialOpeners: 30,
    systemDesign: 0,
    softwareDev: 20,
    dailyReads: 20,
  }

  return (
    <>
      <NavigationPanel />
      <aside
        className={cn(
          'ixed fixed z-30 flex h-screen flex-col border-base-300 border-r bg-base-200',
          !isResizing && 'transition-all duration-300'
        )}
        style={{ width: `${width}px` }}
      >
        <ResizeHandle />
        {/* User Profile Section - Clickable */}
        <button
          type="button"
          onClick={toggle}
          className="w-full border-base-300 border-b px-6 py-4 text-left transition-colors hover:bg-base-300"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 flex-shrink items-center justify-center rounded bg-primary/10 font-semibold">
              {getUserDisplayName().charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium text-primary">{getUserDisplayName()}</p>
              <p className="truncate text-text-tertiary text-xs">Personal Workspace</p>
            </div>
          </div>
        </button>

        {/* Scrollable Content */}
        <div
          className={cn(
            'flex-1 space-y-4 overflow-y-auto p-4',
            isResizing && 'pointer-events-none select-none'
          )}
        >
          {isBookmarksPage ? (
            <>
              {/* Primary Navigation */}
              <SidebarSection>
                <SidebarItem
                  label="Unsorted"
                  count={counts.all}
                  path="/bookmarks"
                  isActive={isActive('/bookmarks')}
                />
                <SidebarItem
                  label="Search"
                  path="/bookmarks/search"
                  isActive={isActive('/bookmarks/search')}
                />
                <SidebarItem
                  label="Trash"
                  path="/bookmarks/trash"
                  isActive={isActive('/bookmarks/trash')}
                />
              </SidebarSection>

              {/* Smart Links */}
              <SidebarSection title="Smart Links">
                <SidebarItem
                  label="Hoarder Tabs"
                  count={counts.hoarderTabs}
                  path="/bookmarks/hoarder-tabs"
                  isActive={isActive('/bookmarks/hoarder-tabs')}
                />
                <SidebarItem
                  label="Pinned"
                  count={counts.pinned}
                  path="/bookmarks/pinned"
                  isActive={isActive('/bookmarks/pinned')}
                />
                <SidebarItem
                  label="Serial Openers"
                  count={counts.serialOpeners}
                  path="/bookmarks/serial-openers"
                  isActive={isActive('/bookmarks/serial-openers')}
                />
              </SidebarSection>

              {/* Collections */}
              <SidebarSection title="Collections">
                {isLoadingCollections ? (
                  <div className="px-4 py-2 text-sm text-text-tertiary">Loading collections...</div>
                ) : collections && collections.length > 0 ? (
                  collections.map((collection) => (
                    <SidebarItem
                      key={collection.id}
                      label={collection.name}
                      icon={collection.icon ? <span>{collection.icon}</span> : undefined}
                      count={collection.bookmarks_count}
                      path={`/bookmarks/collection/${collection.id}`}
                      isActive={isActive(`/bookmarks/collection/${collection.id}`)}
                    />
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-text-tertiary">No collections yet</div>
                )}
              </SidebarSection>
            </>
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center">
              <p className="text-sm text-text-tertiary">
                Click the profile above to access navigation
              </p>
            </div>
          )}
        </div>

        {/* Brand Footer */}
        <div className="border-base-300 border-t p-4">
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="font-bold text-lg text-primary">Syrupy</span>
          </div>
        </div>
      </aside>
    </>
  )
}
