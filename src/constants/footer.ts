import { ROUTES } from '@/constants/routes'
import { getShopPath, ShopCategoryId } from '@/constants/shop'
import type { FooterColumn } from '@/types/layout.types'

export const FOOTER_DESCRIPTION =
  'PTA approved and non-approved used iPhones, accessories and trade-ins — sourced, tested and warrantied. Mercantile certified.'

// Pages other than shop/trade/support don't exist yet, so those links are placeholders.
export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    title: 'Shop',
    links: [
      { label: 'iPhones', to: getShopPath(ShopCategoryId.Iphones) },
      { label: 'Audio', to: getShopPath(ShopCategoryId.Audio) },
      { label: 'Wearables', to: getShopPath(ShopCategoryId.Wearables) },
      { label: 'Accessories', to: getShopPath(ShopCategoryId.Accessories) },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact us', to: ROUTES.support },
      { label: 'Shipping & returns', to: ROUTES.support },
      { label: 'Warranty', to: ROUTES.support },
      { label: 'FAQs', to: ROUTES.support },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Certifications', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
]

/** Manual payment methods enabled in Shopify at launch (no online card payments). */
export const PAYMENT_METHODS = ['Cash on Delivery', 'Bank transfer', 'EasyPaisa', 'JazzCash'] as const

export const COPYRIGHT_TEXT = `© ${new Date().getFullYear()} Apex Gadget. All rights reserved.`
