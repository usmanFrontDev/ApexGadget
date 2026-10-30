import type { PromoLayout } from '@/constants/home'

export interface CtaLink {
  label: string
  /** Internal route (react-router). */
  to?: string
  /** Plain link: hash anchor or external URL. */
  href?: string
}

export interface SocialLink {
  label: string
  /** Short text shown inside the round button. */
  shortLabel: string
  href: string
}

export interface HeroContent {
  badge: string
  titleLines: readonly string[]
  description: string
  highlights: readonly string[]
  primaryCta: CtaLink
  secondaryCta: CtaLink
  followLabel: string
}

export interface PromoCardData {
  id: string
  label: string
  titleLines: readonly string[]
  description: string
  cta: CtaLink & { to: string }
  image: string
  imageAlt: string
  /** Picture placement preset (the Tailwind positioning lives in code, not in the CMS). */
  layout: PromoLayout
}

export interface CategoryItem {
  id: string
  name: string
  /** Optional: the Storefront API has no collection count, so the card shows none by default. */
  productCount?: number
  image: string
  to: string
}

export interface BannerSlide {
  id: string
  image: string
  alt: string
}

export interface FeatureItem {
  id: string
  title: string
  description: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  rating: number
}
