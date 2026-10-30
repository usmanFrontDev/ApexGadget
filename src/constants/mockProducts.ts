import headphonesImage from '@/assets/images/category-headphones.png'
import { productPath } from '@/constants/routes'
import {
  ProductColor,
  ProductPtaStatus,
  ProductGrade,
  ProductStorage,
  ShopCategoryId,
  ShopModelId,
} from '@/constants/shop'
import { getBatteryRange } from '@/lib/battery'
import type { ProductSummary } from '@/types/product.types'

let created = 0
const nextDate = () => new Date(Date.UTC(2026, 9, 1 - created++)).toISOString()

interface IphoneInput {
  title: string
  model: ShopModelId
  storage: ProductStorage
  color: ProductColor
  battery: number
  ptaStatus: ProductPtaStatus
  grade: ProductGrade
  price: number
  /** Mock of a sold listing: stays online as "Sold". */
  sold?: boolean
}

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-')

const iphone = (input: IphoneInput): ProductSummary => {
  const handle = slug(`${input.model}-${input.title}-${input.storage}-${input.color}`)
  return {
    id: handle,
    handle,
    title: input.title,
    subtitle: input.storage.toUpperCase(),
    priceAmount: input.price,
    currencyCode: 'PKR',
    image: headphonesImage,
    to: productPath(handle),
    category: ShopCategoryId.Iphones,
    model: input.model,
    storage: input.storage,
    color: input.color,
    batteryHealth: input.battery,
    batteryBucket: getBatteryRange(input.battery),
    ptaStatus: input.ptaStatus,
    grade: input.grade,
    availableForSale: input.sold ? false : undefined,
    createdAt: nextDate(),
  }
}

interface AccessoryInput {
  category: ShopCategoryId
  title: string
  subtitle: string
  price: number
  image: string
  grade: ProductGrade
  ptaStatus?: ProductPtaStatus
  battery?: number
}

const accessory = (input: AccessoryInput): ProductSummary => ({
  id: slug(input.title),
  handle: slug(input.title),
  title: input.title,
  subtitle: input.subtitle,
  priceAmount: input.price,
  currencyCode: 'PKR',
  image: input.image,
  to: productPath(slug(input.title)),
  category: input.category,
  grade: input.grade,
  ptaStatus: input.ptaStatus,
  batteryHealth: input.battery,
  batteryBucket: input.battery === undefined ? undefined : getBatteryRange(input.battery),
  createdAt: nextDate(),
})

const { Pta, NonPta, Jv } = ProductPtaStatus
const { Excellent, VeryGood, Good, New } = ProductGrade
const { Black, White, Blue, Red, Purple, Gold, NaturalTitanium, Graphite } = ProductColor
const { Gb64, Gb128, Gb256, Gb512 } = ProductStorage

// Mock catalogue (best selling first; every product shows the same placeholder image) — used while the Shopify store is unavailable
// (VITE_USE_MOCK_DATA=true). Same shape the Shopify service produces.
export const MOCK_PRODUCTS: readonly ProductSummary[] = [
  iphone({ title: 'iPhone 16 Pro', model: ShopModelId.Iphone16, storage: Gb256, color: NaturalTitanium, battery: 98, ptaStatus: Pta, grade: New, price: 450_000 }),
  iphone({ title: 'iPhone 16', model: ShopModelId.Iphone16, storage: Gb128, color: Blue, battery: 95, ptaStatus: Jv, grade: Excellent, price: 330_000 }),
  iphone({ title: 'iPhone 15 Pro', model: ShopModelId.Iphone15, storage: Gb256, color: NaturalTitanium, battery: 96, ptaStatus: Pta, grade: Excellent, price: 359_500 }),
  iphone({ title: 'iPhone 15', model: ShopModelId.Iphone15, storage: Gb128, color: Blue, battery: 92, ptaStatus: Pta, grade: VeryGood, price: 299_500 }),
  iphone({ title: 'iPhone 14 Pro', model: ShopModelId.Iphone14, storage: Gb256, color: Black, battery: 94, ptaStatus: Pta, grade: Excellent, price: 279_500 }),
  iphone({ title: 'iPhone 13', model: ShopModelId.Iphone13, storage: Gb128, color: Red, battery: 88, ptaStatus: NonPta, grade: Good, price: 219_500 }),
  iphone({ title: 'iPhone 13 Pro', model: ShopModelId.Iphone13, storage: Gb256, color: Graphite, battery: 95, ptaStatus: Pta, grade: Excellent, price: 259_500 }),
  iphone({ title: 'iPhone 12', model: ShopModelId.Iphone12, storage: Gb128, color: Blue, battery: 87, ptaStatus: Pta, grade: VeryGood, price: 179_500 }),
  iphone({ title: 'iPhone 15 Pro', model: ShopModelId.Iphone15, storage: Gb512, color: Black, battery: 99, ptaStatus: Pta, grade: New, price: 419_500 }),
  iphone({ title: 'iPhone SE (2022)', model: ShopModelId.IphoneSe, storage: Gb128, color: Black, battery: 85, ptaStatus: Pta, grade: Good, price: 159_500 }),
  iphone({ title: 'iPhone 14', model: ShopModelId.Iphone14, storage: Gb256, color: Purple, battery: 90, ptaStatus: Pta, grade: VeryGood, price: 239_500 }),
  iphone({ title: 'iPhone 15', model: ShopModelId.Iphone15, storage: Gb256, color: Black, battery: 97, ptaStatus: Pta, grade: Excellent, price: 319_500 }),
  iphone({ title: 'iPhone 14 Pro', model: ShopModelId.Iphone14, storage: Gb128, color: Gold, battery: 91, ptaStatus: Pta, grade: VeryGood, price: 263_500 }),
  iphone({ title: 'iPhone 14', model: ShopModelId.Iphone14, storage: Gb256, color: Blue, battery: 88, ptaStatus: NonPta, grade: Good, price: 231_500 }),
  iphone({ title: 'iPhone 13', model: ShopModelId.Iphone13, storage: Gb256, color: Blue, battery: 89, ptaStatus: NonPta, grade: Good, price: 211_500 }),
  iphone({ title: 'iPhone 13', model: ShopModelId.Iphone13, storage: Gb512, color: Black, battery: 86, ptaStatus: NonPta, grade: Good, price: 239_500 }),
  iphone({ title: 'iPhone 12', model: ShopModelId.Iphone12, storage: Gb64, color: White, battery: 84, ptaStatus: NonPta, grade: Good, price: 151_500 }),
  iphone({ title: 'iPhone 12 Pro', model: ShopModelId.Iphone12, storage: Gb256, color: Gold, battery: 82, ptaStatus: NonPta, grade: Good, price: 195_500 }),
  iphone({ title: 'iPhone 11', model: ShopModelId.Iphone11, storage: Gb64, color: White, battery: 85, ptaStatus: NonPta, grade: Good, price: 131_500, sold: true }),
  iphone({ title: 'iPhone 11', model: ShopModelId.Iphone11, storage: Gb128, color: Black, battery: 79, ptaStatus: NonPta, grade: Good, price: 139_500 }),
  iphone({ title: 'iPhone SE (2022)', model: ShopModelId.IphoneSe, storage: Gb64, color: Red, battery: 90, ptaStatus: Pta, grade: VeryGood, price: 139_500 }),
  accessory({ category: ShopCategoryId.Audio, title: 'AirPods Pro (2nd Gen)', subtitle: 'USB-C', price: 79_500, image: headphonesImage, grade: Excellent, ptaStatus: Pta, battery: 97 }),
  accessory({ category: ShopCategoryId.Wearables, title: 'Apple Watch Series 9', subtitle: 'GPS · 41mm', price: 131_500, image: headphonesImage, grade: VeryGood, ptaStatus: Pta, battery: 92 }),
  accessory({ category: ShopCategoryId.Cases, title: 'MagSafe Case', subtitle: 'iPhone 15 Pro', price: 19_500, image: headphonesImage, grade: New }),
  accessory({ category: ShopCategoryId.Audio, title: 'AirPods Max', subtitle: 'Sky Blue', price: 179_500, image: headphonesImage, grade: VeryGood, ptaStatus: Pta, battery: 94 }),
  accessory({ category: ShopCategoryId.Chargers, title: '20W USB-C Power Adapter', subtitle: 'Original Apple', price: 7_500, image: headphonesImage, grade: New }),
  accessory({ category: ShopCategoryId.Chargers, title: 'MagSafe Charger', subtitle: '1m cable', price: 15_500, image: headphonesImage, grade: New }),
]
