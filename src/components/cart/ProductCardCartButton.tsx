import { ArrowUpRightIcon, BagIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { CART_CONTENT } from '@/constants/cart'
import { PRODUCT_CONTENT } from '@/constants/product'
import { ROUTES } from '@/constants/routes'
import { ButtonSize, IconAnimation } from '@/constants/ui'
import { useCartLineForVariant } from '@/hooks/useCart'
import { useAddToCart } from '@/hooks/useCartMutations'
import { isSingleUnit } from '@/lib/cartView'
import type { ProductSummary } from '@/types/product.types'

export interface ProductCardCartButtonProps {
  product: ProductSummary
}

/**
 * "Add to Cart" of a product card (one click, a toast confirms; the mini-cart does not open). A single-unit item that is
 * already in the cart shows "View cart" instead. Nothing for sold products or products that need an option picked.
 */
export function ProductCardCartButton({ product }: ProductCardCartButtonProps) {
  const addToCart = useAddToCart()
  const line = useCartLineForVariant(product.variantId)

  if (!product.variantId || product.availableForSale === false) return null
  const { variantId } = product

  if (line && isSingleUnit(line)) {
    return (
      <Button
        to={ROUTES.cart}
        size={ButtonSize.Xs}
        icon={<ArrowUpRightIcon width={12} height={12} />}
        iconAnimation={IconAnimation.PointRight}
        fullWidth
        className="mt-3 shadow-primary-soft"
      >
        {CART_CONTENT.viewCartButton}
      </Button>
    )
  }

  return (
    <Button
      type="button"
      size={ButtonSize.Xs}
      icon={<BagIcon width={14} height={14} />}
      fullWidth
      disabled={addToCart.isPending}
      aria-label={`${PRODUCT_CONTENT.addToCart}: ${product.title}`}
      onClick={() => addToCart.mutate({ variantId, productHandle: product.handle, quantity: 1 })}
      className="mt-3 shadow-primary-soft"
    >
      {PRODUCT_CONTENT.addToCart}
    </Button>
  )
}
