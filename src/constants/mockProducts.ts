import headphonesImage from '@/assets/images/category-headphones.png'
import { ROUTES } from '@/constants/routes'
import {
  ProductColor,
  ProductCondition,
  ProductGrade,
  ProductStorage,
  ShopCategoryId,
  ShopModelId,
} from '@/constants/shop'
import type { ProductSummary } from '@/types/product.types'

let created = 0
const nextDate = () => new Date(Date.UTC(2026, 9, 1 - created++)).toISOString()

interface IphoneInput {
  title: string
  model: ShopModelId
  storage: ProductStorage
  color: ProductColor
  battery: number
  condition: ProductCondition
  grade: ProductGrade
  price: number
}

const iphone = (input: IphoneInput): ProductSummary => ({
  id: `${input.model}-${input.title}-${input.storage}-${input.color}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  title: input.title,
  subtitle: input.storage.toUpperCase(),
  priceAmount: input.price,
  currencyCode: 'USD',
  image: headphonesImage,
  to: ROUTES.shop,
  category: ShopCategoryId.Iphones,
  model: input.model,
  storage: input.storage,
  color: input.color,
  batteryHealth: input.battery,
  condition: input.condition,
  grade: input.grade,
  createdAt: nextDate(),
})

interface AccessoryInput {
  title: string
  subtitle: string
  price: number
  image: string
  grade: ProductGrade
  condition?: ProductCondition
  battery?: number
}

const accessory = (input: AccessoryInput): ProductSummary => ({
  id: input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  title: input.title,
  subtitle: input.subtitle,
  priceAmount: input.price,
  currencyCode: 'USD',
  image: input.image,
  to: ROUTES.shop,
  category: ShopCategoryId.Accessories,
  grade: input.grade,
  condition: input.condition,
  batteryHealth: input.battery,
  createdAt: nextDate(),
})

const { Pta, NonPta } = ProductCondition
const { Excellent, VeryGood, Good, New } = ProductGrade
const { Black, White, Blue, Red, Purple, Gold, NaturalTitanium, Graphite } = ProductColor
const { Gb64, Gb128, Gb256, Gb512 } = ProductStorage

// Mock catalogue (best selling first; every product shows the same placeholder image) — used while the Shopify store is unavailable
// (VITE_USE_MOCK_DATA=true). Same shape the Shopify service produces.
export const MOCK_PRODUCTS: readonly ProductSummary[] = [
  iphone({ title: 'iPhone 15 Pro', model: ShopModelId.Iphone15, storage: Gb256, color: NaturalTitanium, battery: 96, condition: Pta, grade: Excellent, price: 899 }),
  iphone({ title: 'iPhone 15', model: ShopModelId.Iphone15, storage: Gb128, color: Blue, battery: 92, condition: Pta, grade: VeryGood, price: 749 }),
  iphone({ title: 'iPhone 14 Pro', model: ShopModelId.Iphone14, storage: Gb256, color: Black, battery: 94, condition: Pta, grade: Excellent, price: 699 }),
  iphone({ title: 'iPhone 13', model: ShopModelId.Iphone13, storage: Gb128, color: Red, battery: 88, condition: NonPta, grade: Good, price: 549 }),
  iphone({ title: 'iPhone 13 Pro', model: ShopModelId.Iphone13, storage: Gb256, color: Graphite, battery: 95, condition: Pta, grade: Excellent, price: 649 }),
  iphone({ title: 'iPhone 12', model: ShopModelId.Iphone12, storage: Gb128, color: Blue, battery: 87, condition: Pta, grade: VeryGood, price: 449 }),
  iphone({ title: 'iPhone 15 Pro', model: ShopModelId.Iphone15, storage: Gb512, color: Black, battery: 99, condition: Pta, grade: New, price: 1049 }),
  iphone({ title: 'iPhone SE (2022)', model: ShopModelId.IphoneSe, storage: Gb128, color: Black, battery: 85, condition: Pta, grade: Good, price: 399 }),
  iphone({ title: 'iPhone 14', model: ShopModelId.Iphone14, storage: Gb256, color: Purple, battery: 90, condition: Pta, grade: VeryGood, price: 599 }),
  iphone({ title: 'iPhone 15', model: ShopModelId.Iphone15, storage: Gb256, color: Black, battery: 97, condition: Pta, grade: Excellent, price: 799 }),
  iphone({ title: 'iPhone 14 Pro', model: ShopModelId.Iphone14, storage: Gb128, color: Gold, battery: 91, condition: Pta, grade: VeryGood, price: 659 }),
  iphone({ title: 'iPhone 14', model: ShopModelId.Iphone14, storage: Gb256, color: Blue, battery: 88, condition: NonPta, grade: Good, price: 579 }),
  iphone({ title: 'iPhone 13', model: ShopModelId.Iphone13, storage: Gb256, color: Blue, battery: 89, condition: NonPta, grade: Good, price: 529 }),
  iphone({ title: 'iPhone 13', model: ShopModelId.Iphone13, storage: Gb512, color: Black, battery: 86, condition: NonPta, grade: Good, price: 599 }),
  iphone({ title: 'iPhone 12', model: ShopModelId.Iphone12, storage: Gb64, color: White, battery: 84, condition: NonPta, grade: Good, price: 379 }),
  iphone({ title: 'iPhone 12 Pro', model: ShopModelId.Iphone12, storage: Gb256, color: Gold, battery: 82, condition: NonPta, grade: Good, price: 489 }),
  iphone({ title: 'iPhone 11', model: ShopModelId.Iphone11, storage: Gb64, color: White, battery: 85, condition: NonPta, grade: Good, price: 329 }),
  iphone({ title: 'iPhone 11', model: ShopModelId.Iphone11, storage: Gb128, color: Black, battery: 79, condition: NonPta, grade: Good, price: 349 }),
  iphone({ title: 'iPhone SE (2022)', model: ShopModelId.IphoneSe, storage: Gb64, color: Red, battery: 90, condition: Pta, grade: VeryGood, price: 349 }),
  accessory({ title: 'AirPods Pro (2nd Gen)', subtitle: 'USB-C', price: 199, image: headphonesImage, grade: Excellent, condition: Pta, battery: 97 }),
  accessory({ title: 'Apple Watch Series 9', subtitle: 'GPS · 41mm', price: 329, image: headphonesImage, grade: VeryGood, condition: Pta, battery: 92 }),
  accessory({ title: 'MagSafe Case', subtitle: 'iPhone 15 Pro', price: 49, image: headphonesImage, grade: New }),
  accessory({ title: 'AirPods Max', subtitle: 'Sky Blue', price: 449, image: headphonesImage, grade: VeryGood, condition: Pta, battery: 94 }),
  accessory({ title: '20W USB-C Power Adapter', subtitle: 'Original Apple', price: 19, image: headphonesImage, grade: New }),
  accessory({ title: 'MagSafe Charger', subtitle: '1m cable', price: 39, image: headphonesImage, grade: New }),
]
