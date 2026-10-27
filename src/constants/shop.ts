import shopBannerImage from '@/assets/images/ShopBanner.png'
import { ROUTES } from '@/constants/routes'
import type { FacetConfig } from '@/types/shop.types'

export const ShopCategoryId = {
  Iphones: 'iphones',
  Accessories: 'accessories',
} as const
export type ShopCategoryId = (typeof ShopCategoryId)[keyof typeof ShopCategoryId]
export const DEFAULT_CATEGORY: ShopCategoryId = ShopCategoryId.Iphones

export const ProductSortKey = {
  Featured: 'featured',
  Newest: 'newest',
  PriceAsc: 'price-asc',
  PriceDesc: 'price-desc',
  TitleAsc: 'title-asc',
} as const
export type ProductSortKey = (typeof ProductSortKey)[keyof typeof ProductSortKey]
export const DEFAULT_SORT: ProductSortKey = ProductSortKey.Featured

export const ProductCondition = {
  Pta: 'pta',
  NonPta: 'non-pta',
} as const
export type ProductCondition = (typeof ProductCondition)[keyof typeof ProductCondition]

export const ProductGrade = {
  New: 'new',
  Excellent: 'excellent',
  VeryGood: 'very-good',
  Good: 'good',
} as const
export type ProductGrade = (typeof ProductGrade)[keyof typeof ProductGrade]

export const GRADE_LABELS: Record<ProductGrade, string> = {
  [ProductGrade.New]: 'New',
  [ProductGrade.Excellent]: 'Excellent',
  [ProductGrade.VeryGood]: 'Very Good',
  [ProductGrade.Good]: 'Good',
}

export const CONDITION_LABELS: Record<ProductCondition, string> = {
  [ProductCondition.Pta]: 'PTA Approved',
  [ProductCondition.NonPta]: 'Non-PTA',
}

export const ShopModelId = {
  Iphone15: 'iphone-15',
  Iphone14: 'iphone-14',
  Iphone13: 'iphone-13',
  Iphone12: 'iphone-12',
  Iphone11: 'iphone-11',
  IphoneSe: 'iphone-se',
} as const
export type ShopModelId = (typeof ShopModelId)[keyof typeof ShopModelId]

export const ProductStorage = {
  Gb64: '64gb',
  Gb128: '128gb',
  Gb256: '256gb',
  Gb512: '512gb',
  Tb1: '1tb',
} as const
export type ProductStorage = (typeof ProductStorage)[keyof typeof ProductStorage]

export const BatteryRange = {
  Excellent: '90-100',
  Good: '85-89',
  Fair: '80-84',
  Low: 'below-80',
} as const
export type BatteryRange = (typeof BatteryRange)[keyof typeof BatteryRange]

export const ProductColor = {
  Black: 'black',
  White: 'white',
  Blue: 'blue',
  Red: 'red',
  Purple: 'purple',
  Gold: 'gold',
  NaturalTitanium: 'natural-titanium',
  Graphite: 'graphite',
} as const
export type ProductColor = (typeof ProductColor)[keyof typeof ProductColor]

export const FacetKey = {
  Models: 'models',
  Storages: 'storages',
  Conditions: 'conditions',
  BatteryRanges: 'batteryRanges',
  Colors: 'colors',
} as const
export type FacetKey = (typeof FacetKey)[keyof typeof FacetKey]

/** Sidebar filters, in display order. */
export const SHOP_FACETS: readonly FacetConfig[] = [
  {
    key: FacetKey.Models,
    param: 'model',
    title: 'Model',
    options: [
      { value: ShopModelId.Iphone15, label: 'iPhone 15' },
      { value: ShopModelId.Iphone14, label: 'iPhone 14' },
      { value: ShopModelId.Iphone13, label: 'iPhone 13' },
      { value: ShopModelId.Iphone12, label: 'iPhone 12' },
      { value: ShopModelId.Iphone11, label: 'iPhone 11' },
      { value: ShopModelId.IphoneSe, label: 'iPhone SE' },
    ],
  },
  {
    key: FacetKey.Storages,
    param: 'storage',
    title: 'Storage',
    options: [
      { value: ProductStorage.Gb64, label: '64GB' },
      { value: ProductStorage.Gb128, label: '128GB' },
      { value: ProductStorage.Gb256, label: '256GB' },
      { value: ProductStorage.Gb512, label: '512GB' },
      { value: ProductStorage.Tb1, label: '1TB' },
    ],
  },
  {
    key: FacetKey.Conditions,
    param: 'condition',
    title: 'Condition',
    options: [
      { value: ProductCondition.Pta, label: CONDITION_LABELS[ProductCondition.Pta] },
      { value: ProductCondition.NonPta, label: CONDITION_LABELS[ProductCondition.NonPta] },
    ],
  },
  {
    key: FacetKey.BatteryRanges,
    param: 'battery',
    title: 'Battery health',
    options: [
      { value: BatteryRange.Excellent, label: '90% – 100%' },
      { value: BatteryRange.Good, label: '85% – 89%' },
      { value: BatteryRange.Fair, label: '80% – 84%' },
      { value: BatteryRange.Low, label: 'Below 80%' },
    ],
  },
  {
    key: FacetKey.Colors,
    param: 'color',
    title: 'Color',
    options: [
      { value: ProductColor.Black, label: 'Black', swatchClass: 'bg-[#1d1d1f]' },
      { value: ProductColor.White, label: 'White', swatchClass: 'bg-[#f1f1f3]' },
      { value: ProductColor.Blue, label: 'Blue', swatchClass: 'bg-[#2b8fe0]' },
      { value: ProductColor.Red, label: 'Red', swatchClass: 'bg-[#e5333b]' },
      { value: ProductColor.Purple, label: 'Purple', swatchClass: 'bg-[#a259f7]' },
      { value: ProductColor.Gold, label: 'Gold', swatchClass: 'bg-[#f6dc8f]' },
      { value: ProductColor.NaturalTitanium, label: 'Natural Titanium', swatchClass: 'bg-[#a89b8e]' },
      { value: ProductColor.Graphite, label: 'Graphite', swatchClass: 'bg-[#4a4a4f]' },
    ],
  },
]

/** URL query-string keys that aren't facets (`/shop?category=iphones&sort=price-asc&page=2`). */
export const ShopParam = {
  Category: 'category',
  Sort: 'sort',
  MinPrice: 'min',
  MaxPrice: 'max',
  Page: 'page',
  Search: 'q',
} as const

export const SHOP_PAGE_SIZE = 12
export const SHOP_CURRENCY_CODE = 'USD'
export const SHOP_PRICE_DEBOUNCE_MS = 300
/** Slider bounds are the cheapest/dearest product rounded to this step. */
export const PRICE_BOUNDS_STEP = 50
export const PRICE_SLIDER_STEP = 10
export const DESKTOP_FILTERS_QUERY = '(min-width: 1024px)'

export const SORT_OPTIONS: readonly { value: ProductSortKey; label: string }[] = [
  { value: ProductSortKey.Featured, label: 'Featured' },
  { value: ProductSortKey.Newest, label: 'Newest' },
  { value: ProductSortKey.PriceAsc, label: 'Price: low to high' },
  { value: ProductSortKey.PriceDesc, label: 'Price: high to low' },
  { value: ProductSortKey.TitleAsc, label: 'Name: A to Z' },
]

export const SHOP_PAGE_CONTENT: Record<ShopCategoryId, { title: string; description: string }> = {
  [ShopCategoryId.Iphones]: {
    title: 'Shop iPhones',
    description:
      'Premium used and refurbished iPhones. Tested, verified, and backed by our quality guarantee.',
  },
  [ShopCategoryId.Accessories]: {
    title: 'Shop accessories',
    description: 'Original Apple audio, wearables, chargers and cases for your whole eco system.',
  },
}

/** Quick-select pills under the title. `model` pills pick a single model. */
export const SHOP_PILLS: readonly {
  id: string
  label: string
  category: ShopCategoryId
  model?: ShopModelId
}[] = [
  { id: 'all-iphones', label: 'All iPhones', category: ShopCategoryId.Iphones },
  { id: 'iphone-15', label: 'iPhone 15', category: ShopCategoryId.Iphones, model: ShopModelId.Iphone15 },
  { id: 'iphone-14', label: 'iPhone 14', category: ShopCategoryId.Iphones, model: ShopModelId.Iphone14 },
  { id: 'iphone-13', label: 'iPhone 13', category: ShopCategoryId.Iphones, model: ShopModelId.Iphone13 },
  { id: 'accessories', label: 'Accessories', category: ShopCategoryId.Accessories },
]

// Mock banner — replaced by an image uploaded in Shopify / the CMS later.
export const SHOP_BANNER = {
  image: shopBannerImage,
  alt: 'Find your next iPhone. Without the full-price drama. Trade in your old device and get the best value towards your next iPhone.',
  to: ROUTES.trade,
} as const

/**
 * Shopify product tags the catalogue is built from (case-insensitive), e.g.
 * `model:iphone-15`, `storage:256gb`, `battery:96`, `color:black`, `grade:excellent`, `pta` / `non-pta`.
 */
export const SHOPIFY_TAG = {
  Model: 'model:',
  Storage: 'storage:',
  Battery: 'battery:',
  Color: 'color:',
  Grade: 'grade:',
} as const
export const SHOPIFY_CONDITION_TAGS: Record<ProductCondition, string> = {
  [ProductCondition.Pta]: 'pta',
  [ProductCondition.NonPta]: 'non-pta',
}
/** Shopify `productType` of phones; every other type is treated as an accessory. */
export const SHOPIFY_IPHONE_PRODUCT_TYPE = 'iPhones'

export function getShopPath(category?: ShopCategoryId) {
  return category ? `${ROUTES.shop}?${ShopParam.Category}=${category}` : ROUTES.shop
}
