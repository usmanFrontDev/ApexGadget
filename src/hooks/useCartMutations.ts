import { useIsMutating, useMutation, useMutationState, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { CART_CONTENT } from '@/constants/cart'
import { cartKeys } from '@/constants/queryKeys'
import { showItemRemovedToast } from '@/lib/cartToasts'
import { applyTotals } from '@/lib/cartTotals'
import {
  addLines,
  createCart,
  removeLines,
  updateDiscountCodes,
  updateLines,
  updateNote,
} from '@/services/cart.service'
import { announce } from '@/store/useAnnouncerStore'
import { useCartStore } from '@/store/useCartStore'
import {
  type Cart,
  CartError,
  CartErrorCode,
  type CartLineInput,
  type CartResult,
  CartWarningCode,
} from '@/types/cart.types'

/** One queue for every cart mutation, so two quick clicks can't race. */
const CART_SCOPE = { id: 'cart' } as const

function requireCartId(): string {
  const id = useCartStore.getState().cartId
  if (!id) throw new CartError(CartErrorCode.NotFound, CART_CONTENT.toast.failed)
  return id
}

/** Message safe to show: a CartError's own text, otherwise the generic one. */
const userMessage = (error: unknown, fallback: string) =>
  error instanceof CartError && error.code !== CartErrorCode.NotConnected ? error.message : fallback

function useCartCache() {
  const queryClient = useQueryClient()
  return {
    /** Writes the cart a mutation returned into the cache and toasts what the service adjusted. */
    commit: ({ cart, warnings }: CartResult) => {
      queryClient.setQueryData<Cart | null>(cartKeys.detail(cart.id), cart)
      const clamped = warnings.find((warning) => warning.code === CartWarningCode.QuantityClamped)
      if (clamped) toast(CART_CONTENT.toast.clamped.replace('{n}', String(clamped.available)))
    },
    queryClient,
  }
}

/** Creates the cart on the first add (or when the stored one has expired), otherwise adds to it. */
async function addToCartFlow(input: CartLineInput): Promise<CartResult> {
  const { cartId, clearCartId, setCartId } = useCartStore.getState()
  if (cartId) {
    try {
      return await addLines(cartId, [input])
    } catch (error) {
      if (!(error instanceof CartError && error.code === CartErrorCode.NotFound)) throw error
      clearCartId()
    }
  }
  const created = await createCart([input])
  setCartId(created.cart.id)
  return created
}

/**
 * Add a line (product page, product cards). A toast confirms it; the mini-cart is NOT opened (only the header icon opens
 * it). A single-unit item that is already in the cart is not added twice (info toast).
 */
export function useAddToCart() {
  const { commit } = useCartCache()
  return useMutation({
    mutationKey: cartKeys.mutation('add'),
    scope: CART_SCOPE,
    mutationFn: addToCartFlow,
    onSuccess: (result, input) => {
      commit(result)
      toast.success(CART_CONTENT.toast.added)
      const line = result.cart.lines.find((item) => item.variantId === input.variantId)
      announce(CART_CONTENT.announce.added.replace('{title}', line?.productTitle ?? ''))
    },
    onError: (error) => {
      if (error instanceof CartError && error.code === CartErrorCode.SingleUnitInCart) {
        toast(CART_CONTENT.toast.singleUnit)
        return
      }
      toast.error(userMessage(error, CART_CONTENT.toast.addFailed))
    },
  })
}

/** Change a line's quantity (clamped to the stock by the service). */
export function useUpdateCartLine() {
  const { commit } = useCartCache()
  return useMutation({
    mutationKey: cartKeys.mutation('update-line'),
    scope: CART_SCOPE,
    mutationFn: ({ lineId, quantity }: { lineId: string; quantity: number }) =>
      updateLines(requireCartId(), [{ id: lineId, quantity }]),
    onSuccess: (result) => {
      commit(result)
      announce(CART_CONTENT.announce.updated)
    },
    onError: (error) => toast.error(userMessage(error, CART_CONTENT.toast.failed)),
  })
}

/** Remove a line: optimistic, rolled back when the request fails. */
export function useRemoveCartLine() {
  const { commit, queryClient } = useCartCache()
  return useMutation({
    mutationKey: cartKeys.mutation('remove-line'),
    scope: CART_SCOPE,
    mutationFn: (lineId: string) => removeLines(requireCartId(), [lineId]),
    onMutate: async (lineId) => {
      const key = cartKeys.detail(requireCartId())
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Cart | null>(key)
      const title = previous?.lines.find((line) => line.id === lineId)?.productTitle ?? ''
      if (previous) {
        queryClient.setQueryData<Cart | null>(
          key,
          applyTotals({ ...previous, lines: previous.lines.filter((line) => line.id !== lineId) }),
        )
      }
      return { key, previous, title }
    },
    onError: (error, _lineId, context) => {
      if (context?.previous) queryClient.setQueryData<Cart | null>(context.key, context.previous)
      toast.error(userMessage(error, CART_CONTENT.toast.failed))
    },
    onSuccess: (result, _lineId, context) => {
      commit(result)
      showItemRemovedToast(context.title)
      announce(CART_CONTENT.announce.removed.replace('{title}', context.title))
    },
  })
}

/** Apply a discount code. An invalid code leaves the mutation in its error state (the summary shows the notice). */
export function useApplyDiscount() {
  const { commit } = useCartCache()
  return useMutation({
    mutationKey: cartKeys.mutation('discount'),
    scope: CART_SCOPE,
    mutationFn: (code: string) => updateDiscountCodes(requireCartId(), [code]),
    onSuccess: (result) => {
      commit(result)
      announce(CART_CONTENT.announce.discountApplied)
    },
    onError: (error) => {
      if (error instanceof CartError && error.code === CartErrorCode.InvalidDiscount) return
      toast.error(userMessage(error, CART_CONTENT.toast.failed))
    },
  })
}

export function useRemoveDiscount() {
  const { commit } = useCartCache()
  return useMutation({
    mutationKey: cartKeys.mutation('discount'),
    scope: CART_SCOPE,
    mutationFn: () => updateDiscountCodes(requireCartId(), []),
    onSuccess: (result) => {
      commit(result)
      announce(CART_CONTENT.announce.discountRemoved)
    },
    onError: (error) => toast.error(userMessage(error, CART_CONTENT.toast.failed)),
  })
}

/** Save the delivery note (call it debounced). */
export function useUpdateCartNote() {
  const { commit } = useCartCache()
  return useMutation({
    mutationKey: cartKeys.mutation('note'),
    scope: CART_SCOPE,
    mutationFn: (note: string) => updateNote(requireCartId(), note),
    onSuccess: commit,
    onError: (error) => toast.error(userMessage(error, CART_CONTENT.toast.failed)),
  })
}

/** True while any cart request is running (checkout waits for it). */
export const useIsCartBusy = () => useIsMutating({ mutationKey: cartKeys.mutations() }) > 0

/** Ids of the lines whose quantity is being changed right now (per-line spinner). */
export function useUpdatingLineIds(): ReadonlySet<string> {
  const variables = useMutationState({
    filters: { mutationKey: cartKeys.mutation('update-line'), status: 'pending' },
    select: (mutation) => (mutation.state.variables as { lineId: string }).lineId,
  })
  return new Set(variables)
}
