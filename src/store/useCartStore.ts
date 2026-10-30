import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { CART_STORAGE_KEY } from '@/constants/cart'
import { safeLocalStorage } from '@/lib/safeStorage'

interface CartState {
  /** Id of the cart (mock or Shopify). The cart itself is server state: see `hooks/useCart.ts`. */
  cartId: string | null
  drawerOpen: boolean
  setCartId: (id: string) => void
  clearCartId: () => void
  openDrawer: () => void
  closeDrawer: () => void
}

/** Only the cart id (persisted) and the mini-cart drawer. Cart data never lives here (TanStack Query owns it). */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartId: null,
      drawerOpen: false,
      setCartId: (id) => set({ cartId: id }),
      clearCartId: () => set({ cartId: null }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: CART_STORAGE_KEY,
      // v1 held the old mock lines; the cart is now rebuilt from its id.
      version: 2,
      migrate: () => ({ cartId: null }),
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ cartId: state.cartId }),
    },
  ),
)
