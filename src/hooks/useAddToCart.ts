import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { addCartLine, removeCartLine, setCartLineQuantity } from '@/services/cart.service'
import { AddToCartStatus, type AddToCartInput } from '@/types/cart.types'

const CART_MESSAGES = {
  added: 'Added to cart',
  alreadyInCart: 'This one is already in your cart',
  failed: "We couldn't add this to your cart. Please try again.",
  removed: 'Removed from cart',
  updateFailed: "We couldn't update your cart. Please try again.",
} as const

/** Add one line to the cart (toasts included). Components call this, never the cart service. */
export function useAddToCart() {
  return useMutation({
    mutationFn: (input: AddToCartInput) => addCartLine(input),
    onSuccess: (status) => {
      if (status === AddToCartStatus.Added) toast.success(CART_MESSAGES.added)
      else toast(CART_MESSAGES.alreadyInCart)
    },
    onError: () => toast.error(CART_MESSAGES.failed),
  })
}

/** Change the quantity of a line already in the cart. */
export function useSetCartLineQuantity() {
  return useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) =>
      setCartLineQuantity(variantId, quantity),
    onError: () => toast.error(CART_MESSAGES.updateFailed),
  })
}

/** Remove a line from the cart. */
export function useRemoveCartLine() {
  return useMutation({
    mutationFn: (variantId: string) => removeCartLine(variantId),
    onSuccess: () => toast(CART_MESSAGES.removed),
    onError: () => toast.error(CART_MESSAGES.updateFailed),
  })
}
