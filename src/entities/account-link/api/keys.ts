// Query keys for HeyHo account linking

export const accountLinkKeys = {
  all: ['account-link'] as const,
  status: () => [...accountLinkKeys.all, 'status'] as const,
}
