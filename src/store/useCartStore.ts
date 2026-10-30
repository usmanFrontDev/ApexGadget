import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { safeLocalStorage } from '@/lib/safeStorage'
import { AddToCartStatus, type AddToCartInput } from '@/types/cart.types'

export const CART_STORAGE_KEY = 'apex.cart.v1'

export interface MockCartLine extends AddToCartInput {
  /** Same as `variantId`: one line per variant. */
  id: string
}

interface CartState {
  lines: MockCartLine[]
  addLine: (input: AddToCartInput) => AddToCartStatus
  /** Sets a line's quantity (at least 1, at most its stock limit). */
  setQuantity: (variantId: string, quantity: number) => void
  removeLine: (variantId: string) => void
  clear: () => void
}

/**
 * MOCK cart (mock mode only): enough to add products and show the header badge.
 * Real cart = Shopify Storefront Cart API behind `services/cart.service.ts` (plan step 6).
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addLine: (input) => {
        const existing = get().lines.find((line) => line.variantId === input.variantId)
        const limit = input.quantityAvailable ?? existing?.quantityAvailable ?? Number.POSITIVE_INFINITY
        const nextQuantity = (existing?.quantity ?? 0) + input.quantity
        if (nextQuantity > limit) return AddToCartStatus.AlreadyInCart

        set((state) => ({
          lines: existing
            ? state.lines.map((line) => (line.variantId === input.variantId ? { ...line, quantity: nextQuantity } : line))
            : [...state.lines, { ...input, id: input.variantId }],
        }))
        return AddToCartStatus.Added
      },
      setQuantity: (variantId, quantity) =>
        set((state) => ({
          lines: state.lines.map((line) =>
            line.variantId === variantId
              ? { ...line, quantity: Math.max(1, Math.min(quantity, line.quantityAvailable ?? Number.POSITIVE_INFINITY)) }
              : line,
          ),
        })),
      removeLine: (variantId) => set((state) => ({ lines: state.lines.filter((line) => line.variantId !== variantId) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: CART_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
)

export const useCartCount = () =>
  useCartStore((state) => state.lines.reduce((sum, line) => sum + line.quantity, 0))

/** The cart line of a variant (mock cart), or `undefined` when it isn't in the cart. */
export const useCartLine = (variantId: string | undefined) =>
  useCartStore((state) => (variantId ? state.lines.find((line) => line.variantId === variantId) : undefined))
