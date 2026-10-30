import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CART_CONTENT } from '@/constants/cart'
import { cartKeys } from '@/constants/queryKeys'
import { appToast } from '@/lib/appToast'
import { USE_MOCK_DATA } from '@/lib/env'
import { validateForCheckout } from '@/services/cart.service'
import { announce } from '@/store/useAnnouncerStore'
import { useCartStore } from '@/store/useCartStore'
import { type Cart, CartError, CartErrorCode } from '@/types/cart.types'

/**
 * Checkout: re-validates the cart first (every line still available). If something changed the cart is refreshed and
 * the notices show; otherwise Shopify's checkout opens (mock mode: an info toast, no navigation).
 */
export function useCheckout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: cartKeys.mutation('checkout'),
    mutationFn: async () => {
      const cartId = useCartStore.getState().cartId
      if (!cartId) throw new CartError(CartErrorCode.NotFound, CART_CONTENT.toast.failed.text)
      return validateForCheckout(cartId)
    },
    onSuccess: ({ cart, valid }) => {
      queryClient.setQueryData<Cart | null>(cartKeys.detail(cart.id), cart)
      if (!valid) {
        appToast.error(CART_CONTENT.toast.checkoutBlocked.title, CART_CONTENT.toast.checkoutBlocked.text)
        announce(CART_CONTENT.toast.checkoutBlocked.text)
        return
      }
      // TODO(shopify): `begin_checkout` analytics event goes here (docs/shopify/09).
      if (USE_MOCK_DATA) {
        appToast.info(CART_CONTENT.toast.checkoutMock.title, CART_CONTENT.toast.checkoutMock.text)
        return
      }
      // TODO(shopify): the redirect to Shopify's hosted checkout.
      window.location.assign(cart.checkoutUrl)
    },
    onError: (error) =>
      appToast.error(
        CART_CONTENT.toast.failed.title,
        error instanceof CartError ? error.message : CART_CONTENT.toast.failed.text,
      ),
  })
}
