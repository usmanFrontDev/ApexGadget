import { BagIcon } from '@/components/icons'
import { IconButton } from '@/components/ui/IconButton'
import { PRODUCT_CONTENT } from '@/constants/product'
import { ROUTES } from '@/constants/routes'
import { useCartLineForVariant } from '@/hooks/useCart'
import { useAddToCart } from '@/hooks/useCartMutations'
import { cn } from '@/lib/cn'
import { isSingleUnit } from '@/lib/cartView'
import type { ProductSummary } from '@/types/product.types'

export interface ProductCardCartIconProps {
  product: ProductSummary
  className?: string
}

/**
 * Round cart icon next to the card's heart: one click adds the product (a toast confirms; the mini-cart does not open).
 * A single unit already in the cart turns red and links to the cart. Nothing for sold products or products with options.
 */
export function ProductCardCartIcon({ product, className }: ProductCardCartIconProps) {
  const addToCart = useAddToCart()
  const line = useCartLineForVariant(product.variantId)

  if (!product.variantId || product.availableForSale === false) return null
  const { variantId } = product

  if (line && isSingleUnit(line)) {
    return (
      <IconButton to={ROUTES.cart} label={`${product.title}: view in cart`} className={cn('text-primary', className)}>
        <BagIcon width={16} height={16} />
      </IconButton>
    )
  }

  return (
    <IconButton
      label={`${PRODUCT_CONTENT.addToCart}: ${product.title}`}
      onClick={() => addToCart.mutate({ variantId, productHandle: product.handle, quantity: 1 })}
      className={className}
    >
      <BagIcon width={16} height={16} />
    </IconButton>
  )
}
