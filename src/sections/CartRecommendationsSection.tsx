import { ShopProductGrid } from '@/components/shop/ShopProductGrid'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CART_CONTENT, CART_RECOMMENDATIONS_MIN } from '@/constants/cart'
import { PRODUCT_ROW_GRID_CLASSES, PRODUCT_ROW_SIZE } from '@/constants/shop'
import { useSimilarProducts } from '@/hooks/useSimilarProducts'
import { getCartTotals } from '@/lib/cartTotals'
import type { Cart } from '@/types/cart.types'

/** Fetch more than we show: sold items and what is already in the cart are filtered out afterwards. */
const SIMILAR_FETCH_LIMIT = 12

export interface CartRecommendationsSectionProps {
  cart: Cart
}

/**
 * "You may also like": products similar to the cart's first available line, without what is already in the cart or
 * sold. One row of 5 like the product page's similar products. Hidden until loaded and when fewer than two remain.
 */
export function CartRecommendationsSection({ cart }: CartRecommendationsSectionProps) {
  const { availableLines } = getCartTotals(cart)
  const similar = useSimilarProducts(availableLines[0]?.productHandle, undefined, SIMILAR_FETCH_LIMIT)

  const inCart = new Set(cart.lines.map((line) => line.productHandle))
  const products = (similar.data ?? [])
    .filter((product) => product.availableForSale !== false && !inCart.has(product.handle))
    .slice(0, PRODUCT_ROW_SIZE)

  if (products.length < CART_RECOMMENDATIONS_MIN) return null

  return (
    <section className="mt-10 sm:mt-14" aria-label={CART_CONTENT.recommendations}>
      <SectionHeading title={CART_CONTENT.recommendations} />
      <div className="mt-5 sm:mt-6">
        <ShopProductGrid products={products} gridClassName={PRODUCT_ROW_GRID_CLASSES} />
      </div>
    </section>
  )
}
