import { Link, useRouterState } from '@tanstack/react-router'
import type React from 'react'
import { useState } from 'react'
import { useAuth } from '@/app/providers'
import { SettingsModal } from '../modals/SettingsModal'

export const Navigation: React.FC = () => {
  const router = useRouterState()
  const location = router.location
  const { user, logout, isAuthenticated } = useAuth()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Journal', path: '/journal' },
    { name: 'Goals', path: '/goals' },
    { name: 'Habits', path: '/habits' },
    { name: 'Mood', path: '/mood' },
    { name: 'Resources', path: '/resources' },
  ]

  const isActive = (path: string) => location.pathname === path

  const getUserDisplayName = () => {
    if (!user) return ''
    if (user.full_name) return user.full_name
    if (user.first_name) return user.first_name
    return user.email
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <nav className="border-gray-200 border-b bg-white shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link
                  to="/dashboard"
                  className="font-bold text-indigo-600 text-xl dark:text-indigo-400"
                >
                  Syrupy
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`${
                      isActive(item.path)
                        ? 'border-indigo-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                    } inline-flex items-center border-b-2 px-1 pt-1 font-medium text-sm transition-colors`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="hidden text-gray-700 text-sm sm:block dark:text-gray-300">
                Welcome, {getUserDisplayName()}
              </span>

              {/* Settings Button - Made more prominent */}
              <button
                onClick={() => {
                  console.log('Settings button clicked!') // Debug log
                  setIsSettingsOpen(true)
                }}
                className="flex items-center space-x-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                title="Settings"
                aria-label="Open Settings"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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
              </button>

              <button
                onClick={logout}
                className="rounded-md bg-gray-100 px-3 py-2 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  )
}
