import type React from 'react'
import { useAccountLinkStatus } from '@/entities/account-link'
import { ConnectHeyHoBanner, HeyHoConnectionStatus } from '@/features/heyho-connection'

export const Settings: React.FC = () => {
  const { data: linkStatus } = useAccountLinkStatus()

  return (
    <div className="min-h-screen bg-base-100">
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-8">
          <h1 className="mb-2 font-bold text-3xl text-text-primary">Settings</h1>
          <p className="text-text-secondary">Manage your account and application preferences</p>
        </div>

        {/* HeyHo Connection Section */}
        <div className="mb-8">
          <h2 className="mb-4 font-semibold text-text-primary text-xl">Integrations</h2>
          {linkStatus?.linked ? (
            <HeyHoConnectionStatus status={linkStatus} />
          ) : (
            <ConnectHeyHoBanner />
          )}
        </div>

        {/* Future settings sections can go here */}
      </div>
    </div>
  )
}
