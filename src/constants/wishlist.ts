export const WISHLIST_STORAGE_KEY = 'apex.wishlist.v1'
export const WISHLIST_PAGE_SIZE = 6
/** Shopify batch limit of the wishlist product lookup (docs/shopify/05 §4b). */
export const WISHLIST_BATCH_SIZE = 50

export const WishlistSort = {
  Newest: 'newest',
  Oldest: 'oldest',
  PriceAsc: 'price-asc',
  PriceDesc: 'price-desc',
} as const
export type WishlistSort = (typeof WishlistSort)[keyof typeof WishlistSort]

export const WISHLIST_SORT_OPTIONS: readonly { value: WishlistSort; label: string }[] = [
  { value: WishlistSort.Newest, label: 'Newest first' },
  { value: WishlistSort.Oldest, label: 'Oldest first' },
  { value: WishlistSort.PriceAsc, label: 'Price: low to high' },
  { value: WishlistSort.PriceDesc, label: 'Price: high to low' },
]

export const WISHLIST_CONTENT = {
  breadcrumb: 'Favorites',
  eyebrow: 'Favorites',
  title: 'Your Favorites',
  lead: "Save the iPhones you love. Compare, return anytime, and make it yours when you're ready.",
  savedItems: 'Saved items',
  remove: 'Remove',
  viewDetails: 'View details',
  unavailableTitle: 'No longer available',
  unavailableText: 'This listing has been removed from the store.',
  empty: {
    title: 'No favorites yet',
    description: 'Tap the heart on any iPhone to save it here and come back to it anytime.',
    action: 'Explore Products',
  },
  error: {
    title: "We couldn't load your favorites",
    description: 'Something went wrong while talking to the store. Please try again.',
  },
  cta: {
    title: 'Still not sure?',
    description: 'Explore our full range of iPhones and find the perfect match for you.',
  },
} as const
