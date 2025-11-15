export interface PageHeaderProps {
  title: string
  description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-3">
      <div>
        <h1 className="text-primary text-xl">{title}</h1>
        <p className="text-sm text-text-tertiary">{description}</p>
      </div>
    </div>
  )
}
