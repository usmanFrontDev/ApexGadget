import { MOCK_CART_ID_PREFIX } from '@/constants/mockCart'
import { MOCK_PRODUCTS } from '@/constants/mockProducts'
import { ShopModelId } from '@/constants/shop'
import { writeMockCart } from '@/services/mock/cartMock'
import type { ProductSummary } from '@/types/product.types'

const variantId = (product: ProductSummary) => `gid://mock/ProductVariant/${product.handle}`

/**
 * DEV ONLY (`/cart?demo=cart`, loaded with a guarded dynamic import so production builds drop it): fills the mock
 * cart with the design scenario: two phones, the second one sold, code APEX10 applied. Returns the cart id.
 */
export function seedDemoCart(): string {
  const available = MOCK_PRODUCTS.find((item) => item.model === ShopModelId.Iphone15 && item.availableForSale !== false)
  const sold = MOCK_PRODUCTS.find((item) => item.availableForSale === false)
  const picked = [available, sold].filter((item): item is ProductSummary => item !== undefined)
  const id = `${MOCK_CART_ID_PREFIX}demo`
  writeMockCart({
    id,
    lines: picked.map((product) => ({ variantId: variantId(product), productHandle: product.handle, quantity: 1 })),
    discountCodes: ['APEX10'],
    note: '',
  })
  return id
}
