import { MOCK_PRODUCT_COLOURS, MOCK_PRODUCTS } from '@/constants/mockProducts'
import { ShopCategoryId, ShopModelId } from '@/constants/shop'
import { labelFor } from '@/lib/filterLabels'
import type { ProductDetail, ProductSpec, ProductSummary, ProductVariant } from '@/types/product.types'

/**
 * MOCK product pages (mock mode only): a plausible detail for any mock catalogue product, built from its summary.
 * The spec values are sample data, not verified Apple specs. Warranty is a PLACEHOLDER (BLOCKED-ON-CLIENT).
 */

const MOCK_GALLERY_SIZE = 5
const MOCK_WARRANTY_MONTHS = 6

const CHIP_BY_MODEL: Record<string, string> = {
  [ShopModelId.Iphone17]: 'A19',
  [ShopModelId.Iphone16]: 'A18',
  [ShopModelId.Iphone15]: 'A16 Bionic',
  [ShopModelId.Iphone14]: 'A15 Bionic',
  [ShopModelId.Iphone13]: 'A15 Bionic',
  [ShopModelId.Iphone12]: 'A14 Bionic',
  [ShopModelId.Iphone11]: 'A13 Bionic',
  [ShopModelId.IphoneSe]: 'A15 Bionic',
}

const isPro = (product: ProductSummary) => /\bpro\b/i.test(product.title)

function phoneSpecs(product: ProductSummary): ProductSpec[] {
  const model = product.model ?? ''
  const modern = [ShopModelId.Iphone17, ShopModelId.Iphone16, ShopModelId.Iphone15].some((id) => id === model)
  return [
    { label: 'Display', value: model === ShopModelId.Iphone11 ? 'Liquid Retina' : 'Super Retina XDR' },
    { label: 'Chip', value: isPro(product) && model === ShopModelId.Iphone15 ? 'A17 Pro' : (CHIP_BY_MODEL[model] ?? 'Apple A-series') },
    { label: 'Camera', value: modern ? '48MP Main' : '12MP Dual' },
    { label: 'Design', value: isPro(product) && modern ? 'Titanium' : 'Glass & aluminium' },
    { label: 'Charging port', value: modern ? 'USB-C' : 'Lightning' },
  ]
}

function phoneDescription(product: ProductSummary): string {
  const battery = product.batteryHealth !== undefined ? `Battery health tested at ${product.batteryHealth}%.` : ''
  return `
    <h3>${product.title}, tested and ready.</h3>
    <p>This ${labelFor(product.grade)?.toLowerCase() ?? ''} ${product.title} (${product.storage?.toUpperCase() ?? ''}) has been through our full test before it ships. ${battery}</p>
    <h4>Key Features</h4>
    <ul>
      <li>Full diagnostic test passed: display, camera, speakers, sensors</li>
      <li>${labelFor(product.ptaStatus) || 'Network'} status stated on the listing</li>
      <li>Original parts, no hybrid panels</li>
      <li>Battery health verified and shown on the page</li>
      <li>Sample data: replaced by your Shopify description</li>
    </ul>`
}

function accessoryDescription(product: ProductSummary): string {
  return `
    <h3>${product.title}</h3>
    <p>${product.subtitle}. Original Apple accessory, inspected before it ships.</p>
    <h4>Key Features</h4>
    <ul>
      <li>Original, inspected and tested</li>
      <li>Works with your whole Apple ecosystem</li>
      <li>Sample data: replaced by your Shopify description</li>
    </ul>`
}


export function buildMockProductDetail(product: ProductSummary): ProductDetail {
  const isPhone = product.category === ShopCategoryId.Iphones
  const sold = product.availableForSale === false
  const colours = MOCK_PRODUCT_COLOURS[product.handle]
  const quantity = sold ? 0 : isPhone ? 1 : 5

  const variants: ProductVariant[] = colours
    ? colours.map((colour) => ({
        id: `gid://mock/ProductVariant/${product.handle}-${colour.toLowerCase()}`,
        title: colour,
        availableForSale: !sold,
        quantityAvailable: quantity,
        priceAmount: product.priceAmount,
        currencyCode: product.currencyCode,
        selectedOptions: [{ name: 'Color', value: colour }],
        image: product.image,
      }))
    : [
        {
          id: `gid://mock/ProductVariant/${product.handle}`,
          title: 'Default Title',
          availableForSale: !sold,
          quantityAvailable: quantity,
          priceAmount: product.priceAmount,
          compareAtAmount: product.compareAtAmount,
          currencyCode: product.currencyCode,
          selectedOptions: [{ name: 'Title', value: 'Default Title' }],
          image: product.image,
        },
      ]

  return {
    ...product,
    // a mock "discount" on the first iPhone, so the strikethrough price and the "Save" chip show up
    compareAtAmount: product.compareAtAmount ?? (isPhone && product.model === ShopModelId.Iphone16 ? Math.round(product.priceAmount * 1.08 / 500) * 500 : undefined),
    descriptionHtml: isPhone ? phoneDescription(product) : accessoryDescription(product),
    images: Array.from({ length: MOCK_GALLERY_SIZE }, (_, index) => ({
      url: product.image ?? '',
      alt: `${product.title} — photo ${index + 1}`,
      width: 240,
      height: 240,
    })).filter((image) => image.url),
    options: colours ? [{ name: 'Color', values: colours }] : [],
    variants,
    warrantyMonths: MOCK_WARRANTY_MONTHS,
    warrantyNote: 'PLACEHOLDER: the warranty policy is set by the client.',
    boxContents: isPhone ? ['Phone', 'USB cable', 'Protective case'] : ['Product'],
    specs: isPhone ? phoneSpecs(product) : [],
    seo: {},
    sold,
  }
}

export function getMockProductDetail(handle: string): ProductDetail | null {
  const product = MOCK_PRODUCTS.find((item) => item.handle === handle)
  return product ? buildMockProductDetail(product) : null
}

/** Same model first, then same category; never the product itself; in-stock first. */
export function getMockSimilarProducts(handle: string, limit = 5): ProductSummary[] {
  const current = MOCK_PRODUCTS.find((item) => item.handle === handle)
  if (!current) return []
  const others = MOCK_PRODUCTS.filter((item) => item.handle !== handle)
  const rank = (item: ProductSummary) =>
    (item.availableForSale === false ? 4 : 0) +
    (item.model && item.model === current.model ? 0 : item.category === current.category ? 1 : 2)
  return others
    .filter((item) => item.category === current.category || (item.model && item.model === current.model))
    .sort((a, b) => rank(a) - rank(b))
    .slice(0, limit)
}

export const MOCK_SHIPPING_POLICY_HTML = `
  <h3>Shipping</h3>
  <p>PLACEHOLDER: delivery areas, rates and times are set by the client in Shopify (Settings → Policies).</p>`

export const MOCK_REFUND_POLICY_HTML = `
  <h3>Returns</h3>
  <p>PLACEHOLDER: the return window and conditions are set by the client in Shopify (Settings → Policies).</p>`
