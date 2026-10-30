import { z } from 'zod'
import { CART_CONTENT, DISCOUNT_CODE_MAX, DISCOUNT_CODE_MIN } from '@/constants/cart'

/** Trimmed, upper-cased, 3 to 32 characters: letters, numbers and hyphens. */
export const discountCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .min(DISCOUNT_CODE_MIN, CART_CONTENT.discount.format)
    .max(DISCOUNT_CODE_MAX, CART_CONTENT.discount.format)
    .regex(/^[A-Z0-9-]+$/, CART_CONTENT.discount.format),
})

export type DiscountCodeValues = z.infer<typeof discountCodeSchema>
