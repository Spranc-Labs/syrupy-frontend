import { create } from 'zustand'

interface NavigationStore {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))
