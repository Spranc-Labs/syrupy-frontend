import { Menu } from 'react-feather'
import { cn } from '@/shared/lib'
import { useSidebarStore } from '@/stores/useSidebarStore'
import { IconButton } from './IconButton'

export interface PageHeaderProps {
  title: string
  description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  const { isCollapsed, toggleCollapsed } = useSidebarStore()

  return (
    <div className={cn('py-3', isCollapsed ? 'w-full px-10' : 'mx-auto max-w-7xl px-6')}>
      <div className="flex items-center gap-4">
        {isCollapsed && (
          <IconButton
            icon={<Menu />}
            onClick={toggleCollapsed}
            size="lg"
            variant="outline"
            aria-label="Open menu"
          />
        )}
        <div>
          <h1 className="text-primary text-xl">{title}</h1>
          <p className="text-sm text-text-tertiary">{description}</p>
        </div>
      </div>
    </div>
  )
}
