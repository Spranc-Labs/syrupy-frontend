import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Shared/UI/Badge',
  component: Badge,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="xs">XS</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
}

export const Outline: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary" outline>
        Primary
      </Badge>
      <Badge variant="secondary" outline>
        Secondary
      </Badge>
      <Badge variant="accent" outline>
        Accent
      </Badge>
      <Badge variant="success" outline>
        Success
      </Badge>
      <Badge variant="warning" outline>
        Warning
      </Badge>
      <Badge variant="error" outline>
        Error
      </Badge>
    </div>
  ),
}

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span>Active</span>
        <Badge variant="success" size="sm">
          Online
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Pending</span>
        <Badge variant="warning" size="sm">
          In Progress
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Inactive</span>
        <Badge variant="error" size="sm">
          Offline
        </Badge>
      </div>
    </div>
  ),
}
