import accessoriesImage from '@/assets/images/accessories.png'
import bannerImage from '@/assets/images/banner-wave.jpg'
import categoryImage from '@/assets/images/category-headphones.png'
import heroImage from '@/assets/images/hero-iphone.png'
import tradeInImage from '@/assets/images/trade-in-iphone.png'
import { MOCK_PRODUCTS } from '@/constants/mockProducts'
import { ROUTES } from '@/constants/routes'
import { getShopPath, PRODUCT_ROW_SIZE, ShopCategoryId } from '@/constants/shop'
import type {
  BannerSlide,
  CategoryItem,
  FeatureItem,
  HeroContent,
  PromoCardData,
  SocialLink,
  Testimonial,
} from '@/types/home.types'
import type { ProductSummary } from '@/types/product.types'

export const CATEGORIES_SECTION_ID = 'categories'

export const HERO_IMAGE = heroImage

export const HERO_CONTENT: HeroContent = {
  badge: 'New drops every Friday',
  titleLines: ['Quality Used IPhones', 'On Best Prices'],
  description:
    'PTA approved and non-approved iPhones, Mercantile certified and put through a full test before they ship. 100% original, at honest prices.',
  highlights: ['PTA & non-PTA approved', 'Mercantile certified', '100% original, lab tested'],
  primaryCta: { label: 'View all products', to: ROUTES.shop },
  secondaryCta: { label: 'Browse categories', href: `#${CATEGORIES_SECTION_ID}` },
  followLabel: 'Follow us',
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: 'Instagram', shortLabel: 'IG', href: '#' },
  { label: 'X (Twitter)', shortLabel: 'X', href: '#' },
  { label: 'YouTube', shortLabel: 'YT', href: '#' },
  { label: 'LinkedIn', shortLabel: 'in', href: '#' },
]

/** Where the picture sits inside a promo card (sm and up). Shopify stores only the preset name. */
export const PromoLayout = {
  TradeIn: 'trade-in',
  Accessories: 'accessories',
} as const
export type PromoLayout = (typeof PromoLayout)[keyof typeof PromoLayout]

export const PROMO_LAYOUT_CLASSES: Record<PromoLayout, string> = {
  [PromoLayout.TradeIn]: 'sm:left-[62.4%] sm:top-[11.3%] sm:w-[40%]',
  [PromoLayout.Accessories]: 'sm:left-[49.9%] sm:-top-[7.4%] sm:w-[48.2%]',
}

export const PROMO_CARDS: readonly PromoCardData[] = [
  {
    id: 'trade-in',
    label: 'Trade in',
    titleLines: ['Trade in your', 'current IPhone'],
    description:
      'Bring in the phone you have, pay only the difference and walk away with a tested, certified upgrade. Valuation takes minutes.',
    cta: { label: 'Get a trade-in quote', to: ROUTES.trade },
    image: tradeInImage,
    imageAlt: 'Hand holding a blue iPhone',
    layout: PromoLayout.TradeIn,
  },
  {
    id: 'accessories',
    label: 'Accessories',
    titleLines: ['Large range of', 'other accessories'],
    description:
      'We have a premium and large range of other apple accessories to maintain your complete IOS eco system.',
    cta: { label: 'Shop accessories', to: ROUTES.shop },
    image: accessoriesImage,
    imageAlt: 'Apple chargers, cables, AirPods and cases',
    layout: PromoLayout.Accessories,
  },
]

// Mock data — replaced by Shopify collections later.
export const CATEGORIES: readonly CategoryItem[] = [
  { id: 'iphones', name: 'iPhones', image: categoryImage, to: getShopPath(ShopCategoryId.Iphones) },
  { id: 'audio', name: 'Audio', image: categoryImage, to: getShopPath(ShopCategoryId.Audio) },
  { id: 'wearables', name: 'Wearables', image: categoryImage, to: getShopPath(ShopCategoryId.Wearables) },
  { id: 'chargers', name: 'Chargers', image: categoryImage, to: getShopPath(ShopCategoryId.Chargers) },
  { id: 'cases', name: 'Cases', image: categoryImage, to: getShopPath(ShopCategoryId.Cases) },
]

export const BANNER_AUTOPLAY_MS = 5000

// Mock slides — replaced by CMS / Shopify content later.
export const BANNER_SLIDES: readonly BannerSlide[] = [
  { id: 'slide-1', image: bannerImage, alt: 'Red silk wave banner' },
  { id: 'slide-2', image: bannerImage, alt: 'Red silk wave banner' },
  { id: 'slide-3', image: bannerImage, alt: 'Red silk wave banner' },
  { id: 'slide-4', image: bannerImage, alt: 'Red silk wave banner' },
]

// Mock bestsellers (the first in-stock iPhones of the mock catalogue, so every card links to a real product page).
// Replaced by the Shopify `bestsellers` collection (plan step 4).
export const BESTSELLERS: readonly ProductSummary[] = MOCK_PRODUCTS.filter(
  (product) => product.category === ShopCategoryId.Iphones && product.availableForSale !== false,
).slice(0, PRODUCT_ROW_SIZE)

export const WHY_SHOP_ITEMS: readonly FeatureItem[] = [
  {
    id: 'pta',
    title: 'PTA & non-PTA',
    description:
      'Both approved and non-approved iPhones, with the status stated on every listing.',
  },
  {
    id: 'mercantile',
    title: 'Mercantile certified',
    description: 'Our certification is independently held, so the claims are checkable.',
  },
  {
    id: 'original',
    title: '100% original',
    description:
      'No hybrid parts, no swapped panels. Certified test results with every unit.',
  },
  {
    id: 'warranty',
    title: 'Genuine & warrantied',
    description: 'Every device is inspected and backed by a written warranty.',
  },
]

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 'hamza',
    quote:
      '“Ordered a laptop expecting the usual runaround. Got a real answer to every question and it shipped the same day.”',
    author: 'Hamza R. · verified buyer',
    rating: 5,
  },
  {
    id: 'sana',
    quote:
      '“They told me plainly it was a non-PTA unit and what that meant. First seller who didn’t dodge the question.”',
    author: 'Sana K. · verified buyer',
    rating: 5,
  },
  {
    id: 'bilal',
    quote:
      '“Traded my old 12 towards a 14 Pro. Paid the difference, got the test report in the box.”',
    author: 'Bilal T. · verified buyer',
    rating: 5,
  },
]

export const NEWSLETTER_CONTENT = {
  titleLines: ['Get first access to new', 'drops and price drops'],
  description: 'One email a week. No spam, unsubscribe anytime.',
  placeholder: 'you@email.com',
  submitLabel: 'Subscribe',
  successMessage: 'Thanks for subscribing!',
} as const
