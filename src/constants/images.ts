import favoritesBanner from '@/assets/images/FavBanner.png'
import tradeInBanner from '@/assets/images/TradeInBanner.png'

/**
 * Page banner artwork. Both files are finished 2172 x 724 (3:1) pictures with the headline, text and steps
 * BAKED IN (docs/shopify/04-image-specs.md "Page banners"): they are shown from `lg`; below that the page
 * writes the same copy as real HTML next to a crop of the phones.
 */
export const PAGE_BANNERS = {
  wishlist: { src: favoritesBanner, width: 2172, height: 724 },
  tradeIn: { src: tradeInBanner, width: 2172, height: 724 },
} as const
