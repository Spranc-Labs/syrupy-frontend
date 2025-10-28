import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'Shared/UI/Alert',
  component: Alert,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Alert>

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'This is an informational message.',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Your operation completed successfully!',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Please be cautious when proceeding.',
  },
}

export const ErrorAlert: Story = {
  args: {
    variant: 'error',
    children: 'An error occurred. Please try again.',
  },
}

export const WithTitle: Story = {
  args: {
    variant: 'success',
    title: 'Success!',
    children: 'Your profile has been updated successfully.',
  },
}

export const WithoutIcon: Story = {
  args: {
    variant: 'info',
    showIcon: false,
    children: 'This alert has no icon.',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert variant="info" title="Information">
        Here is some useful information you should know about.
      </Alert>
      <Alert variant="success" title="Success">
        Your changes have been saved successfully.
      </Alert>
      <Alert variant="warning" title="Warning">
        This action cannot be undone. Please proceed with caution.
      </Alert>
      <Alert variant="error" title="Error">
        Something went wrong. Please try again later.
      </Alert>
    </div>
  ),
}
