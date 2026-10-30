import { CartQuantityControl } from '@/components/cart/CartQuantityControl'
import { BagIcon } from '@/components/icons'
import { IconButton } from '@/components/ui/IconButton'
import { PRODUCT_CONTENT } from '@/constants/product'
import { IconButtonSize, IconButtonVariant, QuantityStepperSize } from '@/constants/ui'
import { useCartLineForVariant } from '@/hooks/useCart'
import { useAddToCart } from '@/hooks/useCartMutations'
import type { ProductSummary } from '@/types/product.types'

export interface ProductCardCartControlProps {
  product: ProductSummary
}

/**
 * Bottom right of a product card, beside the price: a round red bag button adds the product (toast, the mini-cart does
 * not open); once it is in the cart it becomes the quantity control (− / trash, n, +), in sync with every other screen.
 * Nothing for sold products or products with options (those only have "View details").
 */
export function ProductCardCartControl({ product }: ProductCardCartControlProps) {
  const addToCart = useAddToCart()
  const line = useCartLineForVariant(product.variantId)

  if (!product.variantId || product.availableForSale === false) return null
  const { variantId } = product

  if (line && line.availableForSale) {
    return <CartQuantityControl line={line} size={QuantityStepperSize.Xs} removable />
  }

  return (
    <IconButton
      label={`${PRODUCT_CONTENT.addToCart}: ${product.title}`}
      size={IconButtonSize.Lg}
      variant={IconButtonVariant.Primary}
      disabled={addToCart.isPending}
      onClick={() => addToCart.mutate({ variantId, productHandle: product.handle, quantity: 1 })}
    >
      <BagIcon width={19} height={19} />
    </IconButton>
  )
}
