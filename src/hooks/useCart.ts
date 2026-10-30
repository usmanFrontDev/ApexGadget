import { useQuery } from '@tanstack/react-query'
import { cartKeys } from '@/constants/queryKeys'
import { getCart } from '@/services/cart.service'
import { useCartStore } from '@/store/useCartStore'
import type { Cart } from '@/types/cart.types'

const LIGHT_STALE_MS = 30_000

/**
 * The cart (server state). No network without a cart id. `fresh` (cart page, mini-cart): always refetched on mount and on
 * window focus, so a listing that sold in the meantime shows up. Light readers (header badge, product cards) reuse the
 * cache for 30 s. An expired / completed cart is dropped silently (a fresh one is created on the next add).
 */
export function useCart({ fresh = false }: { fresh?: boolean } = {}) {
  const cartId = useCartStore((state) => state.cartId)
  return useQuery({
    queryKey: cartKeys.detail(cartId ?? ''),
    queryFn: async (): Promise<Cart | null> => {
      const cart = await getCart(cartId ?? '')
      if (!cart) useCartStore.getState().clearCartId()
      return cart
    },
    enabled: Boolean(cartId),
    staleTime: fresh ? 0 : LIGHT_STALE_MS,
    refetchOnMount: fresh ? 'always' : true,
    refetchOnWindowFocus: fresh,
  })
}

/** Header badge: every line counts, sold ones too. */
export const useCartCount = () => useCart().data?.totalQuantity ?? 0

/** The cart line of a variant, or `undefined` when it isn't in the cart. */
export const useCartLineForVariant = (variantId: string | undefined) =>
  useCart().data?.lines.find((line) => line.variantId === variantId)
