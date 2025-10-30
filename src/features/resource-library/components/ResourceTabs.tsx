import { cn } from '@/shared/lib'

export type ResourceTab = 'heyho-tabs' | 'reading-list'

export interface ResourceTabsProps {
  activeTab: ResourceTab
  onTabChange: (tab: ResourceTab) => void
  tabCounts?: {
    heyhoTabs?: number
    readingList?: number
  }
}

export function ResourceTabs({ activeTab, onTabChange, tabCounts }: ResourceTabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-8" aria-label="Tabs">
        <button
          type="button"
          onClick={() => onTabChange('heyho-tabs')}
          className={cn(
            'whitespace-nowrap border-b-2 py-4 px-1 font-medium text-sm transition-colors',
            activeTab === 'heyho-tabs'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          )}
        >
          Smart Recommendations
          {tabCounts?.heyhoTabs !== undefined && (
            <span
              className={cn(
                'ml-2 rounded-full px-2.5 py-0.5 text-xs',
                activeTab === 'heyho-tabs'
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              )}
            >
              {tabCounts.heyhoTabs}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange('reading-list')}
          className={cn(
            'whitespace-nowrap border-b-2 py-4 px-1 font-medium text-sm transition-colors',
            activeTab === 'reading-list'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          )}
        >
          Reading List
          {tabCounts?.readingList !== undefined && (
            <span
              className={cn(
                'ml-2 rounded-full px-2.5 py-0.5 text-xs',
                activeTab === 'reading-list'
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              )}
            >
              {tabCounts.readingList}
            </span>
          )}
        </button>
      </nav>
    </div>
  )
}
