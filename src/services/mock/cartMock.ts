import { CART_DEFAULT_MAX_QUANTITY, CART_NOTE_MAX } from '@/constants/cart'
import {
  MOCK_CART_ID_PREFIX,
  MOCK_CART_LATENCY_MS,
  MOCK_CART_STORAGE_KEY,
  MOCK_CHECKOUT_URL,
  MOCK_DISCOUNT_CODES,
} from '@/constants/mockCart'
import { getMockProductDetail } from '@/constants/mockProductDetail'
import { applyTotals, getCartTotals } from '@/lib/cartTotals'
import { labelFor } from '@/lib/filterLabels'
import {
  type Cart,
  CartError,
  CartErrorCode,
  type CartLine,
  type CartLineInput,
  type CartLineUpdate,
  type CartResult,
  type CartService,
  type CartValidation,
  type CartWarning,
  CartWarningCode,
} from '@/types/cart.types'
import type { ProductDetail } from '@/types/product.types'

/**
 * MOCK cart (mock mode only). Its state (ids, quantities, codes, note) lives in localStorage; every line is rebuilt
 * from the mock catalogue on each read, so a listing that sells out shows up as unavailable. Same interface as the
 * Shopify implementation (`services/cart.service.ts`).
 */

export interface StoredLine {
  variantId: string
  productHandle: string
  quantity: number
}

export interface StoredCart {
  id: string
  lines: StoredLine[]
  /** At most one code (every stored code is in the mock table). */
  discountCodes: string[]
  note: string
}

/** Fallback when localStorage is unavailable (private mode, blocked). */
let memoryCart: StoredCart | null = null

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const lineId = (variantId: string) => `line:${variantId}`

function isStoredCart(value: unknown): value is StoredCart {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Partial<StoredCart>
  return typeof candidate.id === 'string' && Array.isArray(candidate.lines) && Array.isArray(candidate.discountCodes)
}

function readStored(): StoredCart | null {
  try {
    const storage = globalThis.localStorage
    if (!storage) return memoryCart
    const raw = storage.getItem(MOCK_CART_STORAGE_KEY)
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    return isStoredCart(parsed) ? { ...parsed, note: parsed.note ?? '' } : null
  } catch {
    return memoryCart
  }
}

function writeStored(cart: StoredCart) {
  memoryCart = cart
  try {
    globalThis.localStorage?.setItem(MOCK_CART_STORAGE_KEY, JSON.stringify(cart))
  } catch {
    // storage unavailable: the in-memory copy keeps working
  }
}

/** Dev tools (`cartDemo.ts`) write a ready-made cart. */
export const writeMockCart = writeStored

const subtitleOf = (detail: ProductDetail) =>
  detail.storage
    ? [detail.storage.toUpperCase(), detail.color ? labelFor(detail.color) : undefined].filter(Boolean).join(' · ')
    : detail.subtitle

function hydrateLine(stored: StoredLine): CartLine | undefined {
  const detail = getMockProductDetail(stored.productHandle)
  const variant = detail?.variants.find((item) => item.id === stored.variantId)
  if (!detail || !variant) return undefined
  const stock = variant.quantityAvailable
  const quantity = variant.availableForSale && stock !== undefined ? Math.min(stored.quantity, stock) : stored.quantity
  return {
    id: lineId(variant.id),
    quantity,
    total: { amount: variant.priceAmount * quantity, currencyCode: variant.currencyCode },
    variantId: variant.id,
    variantTitle: variant.title,
    productHandle: detail.handle,
    productTitle: detail.title,
    subtitle: subtitleOf(detail),
    image: variant.image ?? detail.image,
    imageAlt: detail.imageAlt ?? detail.title,
    unitPrice: { amount: variant.priceAmount, currencyCode: variant.currencyCode },
    compareAtAmount:
      variant.compareAtAmount !== undefined && variant.compareAtAmount > variant.priceAmount
        ? variant.compareAtAmount
        : undefined,
    availableForSale: variant.availableForSale,
    quantityAvailable: stock,
    grade: detail.grade,
    ptaStatus: detail.ptaStatus,
    batteryHealth: detail.batteryHealth,
  }
}

function toCart(stored: StoredCart): Cart {
  const lines = stored.lines.map(hydrateLine).filter((line): line is CartLine => line !== undefined)
  const subtotal = getCartTotals({ lines }).subtotal
  const code = stored.discountCodes[0]
  const percent = code ? MOCK_DISCOUNT_CODES[code]?.percent : undefined
  const amount = percent ? Math.round((subtotal * percent) / 100) : 0
  const currencyCode = lines[0]?.unitPrice.currencyCode ?? 'PKR'

  return applyTotals({
    id: stored.id,
    checkoutUrl: MOCK_CHECKOUT_URL,
    note: stored.note || undefined,
    discountCodes: stored.discountCodes.map((item) => ({ code: item, applicable: item in MOCK_DISCOUNT_CODES })),
    discount: code && amount > 0 ? { code, amount: { amount, currencyCode } } : undefined,
    attributes: [],
    lines,
  })
}

function requireCart(id: string): StoredCart {
  const stored = readStored()
  if (!stored || stored.id !== id) throw new CartError(CartErrorCode.NotFound, 'Your cart has expired.')
  return stored
}

/** Adds one line to a stored cart: single-unit duplicates are rejected, quantities are clamped to the stock. */
function addLine(stored: StoredCart, input: CartLineInput, warnings: CartWarning[]) {
  const detail = getMockProductDetail(input.productHandle)
  const variant = detail?.variants.find((item) => item.id === input.variantId)
  if (!detail || !variant || !variant.availableForSale) {
    throw new CartError(CartErrorCode.Unavailable, 'This item is no longer available.')
  }
  const stock = variant.quantityAvailable ?? CART_DEFAULT_MAX_QUANTITY
  const existing = stored.lines.find((line) => line.variantId === input.variantId)
  if (existing && stock === 1) {
    throw new CartError(CartErrorCode.SingleUnitInCart, 'This phone is a single unit and is already in your cart.')
  }
  const wanted = (existing?.quantity ?? 0) + Math.max(1, input.quantity)
  const quantity = Math.min(wanted, stock)
  if (quantity < wanted) {
    warnings.push({ code: CartWarningCode.QuantityClamped, lineId: lineId(variant.id), available: stock })
  }
  if (existing) existing.quantity = quantity
  else stored.lines.push({ variantId: variant.id, productHandle: input.productHandle, quantity })
}

function result(stored: StoredCart, warnings: CartWarning[] = []): CartResult {
  writeStored(stored)
  return { cart: toCart(stored), warnings }
}

export const mockCartService: CartService = {
  async getCart(id) {
    await wait(MOCK_CART_LATENCY_MS)
    const stored = readStored()
    return stored && stored.id === id ? toCart(stored) : null
  },

  async createCart(lines) {
    await wait(MOCK_CART_LATENCY_MS)
    const stored: StoredCart = {
      id: `${MOCK_CART_ID_PREFIX}${crypto.randomUUID()}`,
      lines: [],
      discountCodes: [],
      note: '',
    }
    const warnings: CartWarning[] = []
    lines.forEach((line) => addLine(stored, line, warnings))
    return result(stored, warnings)
  },

  async addLines(cartId, lines) {
    await wait(MOCK_CART_LATENCY_MS)
    const stored = requireCart(cartId)
    const warnings: CartWarning[] = []
    lines.forEach((line) => addLine(stored, line, warnings))
    return result(stored, warnings)
  },

  async updateLines(cartId, updates: CartLineUpdate[]) {
    await wait(MOCK_CART_LATENCY_MS)
    const stored = requireCart(cartId)
    const warnings: CartWarning[] = []
    for (const update of updates) {
      const target = stored.lines.find((line) => lineId(line.variantId) === update.id)
      if (!target) continue
      const stock = hydrateLine(target)?.quantityAvailable ?? CART_DEFAULT_MAX_QUANTITY
      target.quantity = Math.max(1, Math.min(update.quantity, stock))
      if (update.quantity > stock) {
        warnings.push({ code: CartWarningCode.QuantityClamped, lineId: update.id, available: stock })
      }
    }
    return result(stored, warnings)
  },

  async removeLines(cartId, lineIds) {
    await wait(MOCK_CART_LATENCY_MS)
    const stored = requireCart(cartId)
    stored.lines = stored.lines.filter((line) => !lineIds.includes(lineId(line.variantId)))
    return result(stored)
  },

  async updateDiscountCodes(cartId, codes) {
    await wait(MOCK_CART_LATENCY_MS)
    const stored = requireCart(cartId)
    const code = codes[0]?.trim().toUpperCase()
    if (code && !(code in MOCK_DISCOUNT_CODES)) {
      throw new CartError(CartErrorCode.InvalidDiscount, 'Code not valid')
    }
    stored.discountCodes = code ? [code] : []
    return result(stored)
  },

  async updateNote(cartId, note) {
    await wait(MOCK_CART_LATENCY_MS)
    const stored = requireCart(cartId)
    stored.note = note.slice(0, CART_NOTE_MAX)
    return result(stored)
  },

  async validateForCheckout(cartId): Promise<CartValidation> {
    await wait(MOCK_CART_LATENCY_MS)
    const cart = toCart(requireCart(cartId))
    return { cart, valid: getCartTotals(cart).canCheckout }
  },
}
