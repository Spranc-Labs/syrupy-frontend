import type React from 'react'
import { useTheme } from '@/app/providers/ThemeProvider'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, actualTheme } = useTheme()

  const themeOptions = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ] as const

  if (!isOpen) {
    return null
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-25 dark:bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-gray-900 text-lg dark:text-white">Settings</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Theme Section */}
          <div className="mb-6">
            <h4 className="mb-3 font-medium text-gray-700 text-sm dark:text-gray-300">
              Appearance
            </h4>
            <div className="space-y-2">
              {themeOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <input
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={theme === option.value}
                    onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600"
                  />
                  <span className="text-xl">{option.icon}</span>
                  <span className="flex-1 font-medium text-gray-700 text-sm dark:text-gray-300">
                    {option.label}
                    {option.value === 'system' && (
                      <span className="ml-1 block text-gray-500 text-xs dark:text-gray-400">
                        Currently: {actualTheme}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* App Info Section */}
          <div className="mb-6">
            <h4 className="mb-3 font-medium text-gray-700 text-sm dark:text-gray-300">About</h4>
            <div className="space-y-1 rounded-lg bg-gray-50 p-3 text-gray-600 text-sm dark:bg-gray-700 dark:text-gray-400">
              <p>
                <strong>Syrupy</strong> - Personal Journaling Platform
              </p>
              <p>Version 1.0.0</p>
              <p>Built with React + Rails</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-offset-gray-800 dark:hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
