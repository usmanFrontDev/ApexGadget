import { PRODUCT_CONTENT } from '@/constants/product'
import { labelFor } from '@/lib/filterLabels'
import type { ProductDetail, ProductSummary, ProductVariant } from '@/types/product.types'

/** "256GB · PTA Approved · Battery 93%": missing parts are skipped without leaving separators. */
export function getMetaLine(product: ProductDetail): string {
  return [
    product.storage ? product.storage.toUpperCase() : undefined,
    product.ptaStatus ? labelFor(product.ptaStatus) : undefined,
    product.batteryHealth !== undefined ? `Battery ${product.batteryHealth}%` : undefined,
  ]
    .filter(Boolean)
    .join(' · ')
}

/** The variant whose options equal the selection (a product without options has exactly one variant). */
export function findVariant(product: ProductDetail, selection: Readonly<Record<string, string>>): ProductVariant | undefined {
  if (product.options.length === 0) return product.variants[0]
  return product.variants.find((variant) =>
    product.options.every((option) =>
      variant.selectedOptions.some((selected) => selected.name === option.name && selected.value === selection[option.name]),
    ),
  )
}

/** "Detailed Information" rows; rows without a value are not shown. */
export function getDetailRows(product: ProductDetail): { label: string; value: string }[] {
  const rows: { label: string; value: string | undefined }[] = [
    { label: 'Model', value: product.model ? labelFor(product.model) : undefined },
    { label: 'Storage', value: product.storage ? product.storage.toUpperCase() : undefined },
    { label: 'Network', value: product.ptaStatus ? labelFor(product.ptaStatus) : undefined },
    { label: 'Battery Health', value: product.batteryHealth !== undefined ? `${product.batteryHealth}%` : undefined },
    { label: 'Color', value: product.color ? labelFor(product.color) : undefined },
    { label: 'Condition', value: product.grade ? labelFor(product.grade) : undefined },
    { label: PRODUCT_CONTENT.warranty, value: product.warrantyMonths !== undefined ? `${product.warrantyMonths} months` : undefined },
  ]
  return rows.filter((row): row is { label: string; value: string } => Boolean(row.value))
}

/** "PTA Approved · Battery 96%" shown on product cards (falls back to "Original · grade"). */
export function getCardMetaParts(product: ProductSummary): string[] {
  const parts: string[] = []
  if (product.ptaStatus) parts.push(labelFor(product.ptaStatus))
  if (product.batteryHealth !== undefined) parts.push(`Battery ${product.batteryHealth}%`)
  if (parts.length === 0 && product.grade) parts.push('Original', labelFor(product.grade))
  return parts
}
