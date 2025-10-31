import { Link, useRouterState } from '@tanstack/react-router'
import { useAuth } from '@/app/providers'
import { cn } from '@/shared/lib'
import { useNavigationStore } from '@/stores/useNavigationStore'
import { useSidebarStore } from '@/stores/useSidebarStore'

export function NavigationPanel() {
  const router = useRouterState()
  const location = router.location
  const { logout } = useAuth()
  const { isOpen, close } = useNavigationStore()
  const { width: sidebarWidth, isResizing } = useSidebarStore()

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Journal', path: '/journal' },
    { name: 'Goals', path: '/goals' },
    { name: 'Habits', path: '/habits' },
    { name: 'Mood', path: '/mood' },
    { name: 'Resources', path: '/resources' },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        onClick={close}
        className="fixed inset-0 z-40 bg-black/30 transition-opacity"
        aria-label="Close navigation"
      />

      {/* Slide-out Panel - Stacks to right of sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 border-base-300 border-r bg-base-200 shadow-2xl',
          !isResizing && 'transition-transform duration-300 ease-in-out'
        )}
        style={{
          transform: isOpen ? `translateX(${sidebarWidth}px)` : 'translateX(-100%)',
        }}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-base-300 border-b py-4 px-6">
            <h2 className="font-semibold text-text-primary text-lg">Howdy!</h2>
            <button
              type="button"
              onClick={close}
              className="rounded-lg p-2 text-text-tertiary transition-colors hover:bg-base-300"
              aria-label="Close navigation panel"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Close icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-6 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={close}
                className={cn(
                  'flex items-center rounded-lg py-1 font-medium text-sm transition-colors',
                  isActive(item.path)
                    ? 'text-primary font-semibold'
                    : 'text-text-dark hover:text-primary'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex flex-col gap-1.5 border-base-300 border-t py-4 px-6">
            <Link
              to="/settings"
              onClick={close}
              className="flex w-full items-center gap-3 rounded-lg py-1 text-left text-text-dark transition-colors hover:text-primary"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Settings icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="font-medium text-sm">Settings</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                close()
                logout()
              }}
              className="flex w-full items-center gap-3 rounded-lg py-1 text-left text-error transition-colors hover:bg-error/10"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Logout icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
