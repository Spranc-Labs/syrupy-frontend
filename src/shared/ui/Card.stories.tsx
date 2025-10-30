import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Shared/UI/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: <p>This is a simple card with just content.</p>,
  },
}

export const WithTitle: Story = {
  args: {
    title: 'Card Title',
    children: (
      <p>This card has a title. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    ),
  },
}

export const WithImage: Story = {
  args: {
    title: 'Sunset Photo',
    imageSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    children: <p>Beautiful sunset over the mountains.</p>,
  },
}

export const WithActions: Story = {
  args: {
    title: 'Product Card',
    children: <p>Check out this amazing product!</p>,
    actions: (
      <>
        <Button variant="ghost" size="sm">
          Learn More
        </Button>
        <Button variant="primary" size="sm">
          Buy Now
        </Button>
      </>
    ),
  },
}

export const Bordered: Story = {
  args: {
    variant: 'bordered',
    title: 'Bordered Card',
    children: <p>This card has a border.</p>,
  },
}

export const Compact: Story = {
  args: {
    variant: 'compact',
    title: 'Compact Card',
    children: <p>This card has less padding.</p>,
  },
}

export const Complete: Story = {
  args: {
    title: 'Complete Card Example',
    imageSrc: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
    children: (
      <div>
        <p>This card showcases all features:</p>
        <ul className="mt-2 list-inside list-disc">
          <li>Image</li>
          <li>Title</li>
          <li>Content</li>
          <li>Actions</li>
        </ul>
      </div>
    ),
    actions: (
      <>
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Confirm
        </Button>
      </>
    ),
  },
}
