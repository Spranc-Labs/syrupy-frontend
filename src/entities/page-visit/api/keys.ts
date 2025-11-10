export const pageVisitKeys = {
  all: ['pageVisits'] as const,
  actions: () => [...pageVisitKeys.all, 'action'] as const,
  dismiss: (id: string) => [...pageVisitKeys.actions(), 'dismiss', id] as const,
}
