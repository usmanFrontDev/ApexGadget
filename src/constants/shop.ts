import shopBannerImage from '@/assets/images/ShopBanner.png'
import { ROUTES } from '@/constants/routes'

/**
 * Shop categories = Shopify `productType` + a smart collection with the same handle
 * (docs/shopify/10-filters-and-search-discovery.md §3). `all` is the `all-products` collection.
 */
export const ShopCategoryId = {
  All: 'all',
  Iphones: 'iphones',
  Audio: 'audio',
  Wearables: 'wearables',
  Chargers: 'chargers',
  Cases: 'cases',
  Accessories: 'accessories',
} as const
export type ShopCategoryId = (typeof ShopCategoryId)[keyof typeof ShopCategoryId]
export const DEFAULT_CATEGORY: ShopCategoryId = ShopCategoryId.Iphones

/** Shopify `productType` of each category (`accessories` = every other type, `all` = no type). */
export const CATEGORY_PRODUCT_TYPE: Partial<Record<ShopCategoryId, string>> = {
  [ShopCategoryId.Iphones]: 'iPhones',
  [ShopCategoryId.Audio]: 'Audio',
  [ShopCategoryId.Wearables]: 'Wearables',
  [ShopCategoryId.Chargers]: 'Chargers',
  [ShopCategoryId.Cases]: 'Cases',
}
export const OTHER_ACCESSORIES_PRODUCT_TYPE = 'Accessories'

/** Collection handle that serves a category. */
export const CATEGORY_COLLECTION_HANDLE: Record<ShopCategoryId, string> = {
  [ShopCategoryId.All]: 'all-products',
  [ShopCategoryId.Iphones]: 'iphones',
  [ShopCategoryId.Audio]: 'audio',
  [ShopCategoryId.Wearables]: 'wearables',
  [ShopCategoryId.Chargers]: 'chargers',
  [ShopCategoryId.Cases]: 'cases',
  [ShopCategoryId.Accessories]: 'accessories',
}

export const ProductSortKey = {
  Featured: 'featured',
  Newest: 'newest',
  PriceAsc: 'price-asc',
  PriceDesc: 'price-desc',
  TitleAsc: 'title-asc',
  /** Search results only. */
  Relevance: 'relevance',
} as const
export type ProductSortKey = (typeof ProductSortKey)[keyof typeof ProductSortKey]
export const DEFAULT_SORT: ProductSortKey = ProductSortKey.Featured
export const DEFAULT_SEARCH_SORT: ProductSortKey = ProductSortKey.Relevance

export const ProductPtaStatus = {
  Pta: 'pta',
  NonPta: 'non-pta',
  Jv: 'jv',
} as const
export type ProductPtaStatus = (typeof ProductPtaStatus)[keyof typeof ProductPtaStatus]

export const ProductGrade = {
  New: 'new',
  Excellent: 'excellent',
  VeryGood: 'very-good',
  Good: 'good',
} as const
export type ProductGrade = (typeof ProductGrade)[keyof typeof ProductGrade]

export const ShopModelId = {
  Iphone17: 'iphone-17',
  Iphone16: 'iphone-16',
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
  Good: '80-89',
  Fair: '70-79',
  Low: 'below-70',
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

export const PTA_STATUS_LABELS: Record<ProductPtaStatus, string> = {
  [ProductPtaStatus.Pta]: 'PTA Approved',
  [ProductPtaStatus.NonPta]: 'Non-PTA',
  [ProductPtaStatus.Jv]: 'JV',
}

export const GRADE_LABELS: Record<ProductGrade, string> = {
  [ProductGrade.New]: 'New',
  [ProductGrade.Excellent]: 'Excellent',
  [ProductGrade.VeryGood]: 'Very Good',
  [ProductGrade.Good]: 'Good',
}

/**
 * Display labels for known filter / metafield values, in the order they should be listed.
 * Filters themselves come from Shopify (Search & Discovery): this map only prettifies values and
 * orders them. An unknown value still renders (humanised), it is never dropped.
 */
export const FILTER_VALUE_LABELS: Readonly<Record<string, string>> = {
  [ShopModelId.Iphone17]: 'iPhone 17',
  [ShopModelId.Iphone16]: 'iPhone 16',
  [ShopModelId.Iphone15]: 'iPhone 15',
  [ShopModelId.Iphone14]: 'iPhone 14',
  [ShopModelId.Iphone13]: 'iPhone 13',
  [ShopModelId.Iphone12]: 'iPhone 12',
  [ShopModelId.Iphone11]: 'iPhone 11',
  [ShopModelId.IphoneSe]: 'iPhone SE',
  [ProductStorage.Gb64]: '64 GB',
  [ProductStorage.Gb128]: '128 GB',
  [ProductStorage.Gb256]: '256 GB',
  [ProductStorage.Gb512]: '512 GB',
  [ProductStorage.Tb1]: '1 TB',
  ...PTA_STATUS_LABELS,
  [BatteryRange.Excellent]: '90% – 100%',
  [BatteryRange.Good]: '80% – 89%',
  [BatteryRange.Fair]: '70% – 79%',
  [BatteryRange.Low]: 'Below 70%',
  [ProductColor.Black]: 'Black',
  [ProductColor.White]: 'White',
  [ProductColor.Blue]: 'Blue',
  [ProductColor.Red]: 'Red',
  [ProductColor.Purple]: 'Purple',
  [ProductColor.Gold]: 'Gold',
  [ProductColor.NaturalTitanium]: 'Natural Titanium',
  [ProductColor.Graphite]: 'Graphite',
  ...GRADE_LABELS,
}

/** Colour dot of the colour filter, by value. A value without an entry just shows no dot. */
export const FILTER_SWATCH_CLASSES: Readonly<Record<string, string>> = {
  [ProductColor.Black]: 'bg-[#1d1d1f]',
  [ProductColor.White]: 'bg-[#f1f1f3]',
  [ProductColor.Blue]: 'bg-[#2b8fe0]',
  [ProductColor.Red]: 'bg-[#e5333b]',
  [ProductColor.Purple]: 'bg-[#a259f7]',
  [ProductColor.Gold]: 'bg-[#f6dc8f]',
  [ProductColor.NaturalTitanium]: 'bg-[#a89b8e]',
  [ProductColor.Graphite]: 'bg-[#4a4a4f]',
}

/** URL query-string keys that aren't filters (`/shop?category=iphones&sort=price-asc`); filters use `f.*`. */
export const ShopParam = {
  Category: 'category',
  Sort: 'sort',
  Search: 'q',
} as const

export const SHOP_PAGE_SIZE = 12
export const SHOP_CURRENCY_CODE = 'PKR'
export const SHOP_PRICE_DEBOUNCE_MS = 300
/** Mock catalogue only: slider bounds are the cheapest/dearest product rounded to this step. */
export const PRICE_BOUNDS_STEP = 5000
export const PRICE_SLIDER_STEP = 500
export const DESKTOP_FILTERS_QUERY = '(min-width: 1024px)'

export const SORT_OPTIONS: readonly { value: ProductSortKey; label: string }[] = [
  { value: ProductSortKey.Featured, label: 'Featured' },
  { value: ProductSortKey.Newest, label: 'Newest' },
  { value: ProductSortKey.PriceAsc, label: 'Price: low to high' },
  { value: ProductSortKey.PriceDesc, label: 'Price: high to low' },
  { value: ProductSortKey.TitleAsc, label: 'Name: A to Z' },
]

/** Shopify search can only sort by relevance or price. */
export const SEARCH_SORT_OPTIONS: readonly { value: ProductSortKey; label: string }[] = [
  { value: ProductSortKey.Relevance, label: 'Relevance' },
  { value: ProductSortKey.PriceAsc, label: 'Price: low to high' },
  { value: ProductSortKey.PriceDesc, label: 'Price: high to low' },
]

export const SHOP_PAGE_CONTENT: Record<ShopCategoryId, { title: string; description: string }> = {
  [ShopCategoryId.All]: {
    title: 'Shop everything',
    description: 'iPhones and Apple accessories, tested, verified and backed by our quality guarantee.',
  },
  [ShopCategoryId.Iphones]: {
    title: 'Shop iPhones',
    description:
      'Premium used and refurbished iPhones. Tested, verified, and backed by our quality guarantee.',
  },
  [ShopCategoryId.Audio]: {
    title: 'Shop audio',
    description: 'Original Apple AirPods and headphones, tested and ready to use.',
  },
  [ShopCategoryId.Wearables]: {
    title: 'Shop wearables',
    description: 'Apple Watch models with battery health stated on every listing.',
  },
  [ShopCategoryId.Chargers]: {
    title: 'Shop chargers',
    description: 'Original Apple chargers, adapters and cables.',
  },
  [ShopCategoryId.Cases]: {
    title: 'Shop cases',
    description: 'Cases and covers that fit your iPhone.',
  },
  [ShopCategoryId.Accessories]: {
    title: 'Shop accessories',
    description: 'Original Apple audio, wearables, chargers and cases for your whole eco system.',
  },
}

/**
 * Quick-select pills under the title. `model` pills select one value of the model filter
 * (a metafield filter, see `constants/shopify.ts`).
 */
export const SHOP_PILLS: readonly {
  id: string
  label: string
  category: ShopCategoryId
  model?: ShopModelId
}[] = [
  { id: 'all-iphones', label: 'All iPhones', category: ShopCategoryId.Iphones },
  { id: 'iphone-16', label: 'iPhone 16', category: ShopCategoryId.Iphones, model: ShopModelId.Iphone16 },
  { id: 'iphone-15', label: 'iPhone 15', category: ShopCategoryId.Iphones, model: ShopModelId.Iphone15 },
  { id: 'iphone-14', label: 'iPhone 14', category: ShopCategoryId.Iphones, model: ShopModelId.Iphone14 },
  { id: 'iphone-13', label: 'iPhone 13', category: ShopCategoryId.Iphones, model: ShopModelId.Iphone13 },
  { id: 'audio', label: 'Audio', category: ShopCategoryId.Audio },
  { id: 'wearables', label: 'Wearables', category: ShopCategoryId.Wearables },
  { id: 'chargers', label: 'Chargers', category: ShopCategoryId.Chargers },
  { id: 'cases', label: 'Cases', category: ShopCategoryId.Cases },
]

// Mock banner — replaced by an image uploaded in Shopify / the CMS later.
export const SHOP_BANNER = {
  image: shopBannerImage,
  alt: 'Find your next iPhone. Without the full-price drama. Trade in your old device and get the best value towards your next iPhone.',
  to: ROUTES.trade,
} as const

/**
 * Legacy Shopify product tags (`model:iphone-15`, `storage:256gb`, `battery:96`, `color:black`,
 * `grade:excellent`, `pta` / `non-pta` / `jv`), read by the mapper only as a fallback until the
 * `custom.*` metafields are filled in. Remove once the store is migrated.
 */
export const SHOPIFY_TAG = {
  Model: 'model:',
  Storage: 'storage:',
  Battery: 'battery:',
  Color: 'color:',
  Grade: 'grade:',
} as const
export const SHOPIFY_PTA_TAGS: Record<ProductPtaStatus, string> = {
  [ProductPtaStatus.Pta]: 'pta',
  [ProductPtaStatus.NonPta]: 'non-pta',
  [ProductPtaStatus.Jv]: 'jv',
}

export function getShopPath(category?: ShopCategoryId) {
  return category ? `${ROUTES.shop}?${ShopParam.Category}=${category}` : ROUTES.shop
}
