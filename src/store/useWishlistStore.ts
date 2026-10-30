import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { WISHLIST_STORAGE_KEY } from '@/constants/wishlist'
import { safeLocalStorage } from '@/lib/safeStorage'

export interface WishlistItem {
  handle: string
  /** Epoch ms, used by the "Newest first" sort. */
  addedAt: number
}

interface WishlistState {
  items: WishlistItem[]
  has: (handle: string) => boolean
  toggle: (handle: string) => void
  remove: (handle: string) => void
  clear: () => void
}

/** Saved products (handles), persisted in localStorage; still works in memory if storage is blocked. */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      has: (handle) => get().items.some((item) => item.handle === handle),
      toggle: (handle) =>
        set((state) => {
          if (state.items.some((item) => item.handle === handle)) {
            return { items: state.items.filter((item) => item.handle !== handle) }
          }
          // strictly increasing, so two quick taps still sort newest-first
          const addedAt = Math.max(Date.now(), ...state.items.map((item) => item.addedAt + 1))
          return { items: [...state.items, { handle, addedAt }] }
        }),
      remove: (handle) => set((state) => ({ items: state.items.filter((item) => item.handle !== handle) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: WISHLIST_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

export const useIsWishlisted = (handle: string) =>
  useWishlistStore((state) => state.items.some((item) => item.handle === handle))

export const useWishlistCount = () => useWishlistStore((state) => state.items.length)
