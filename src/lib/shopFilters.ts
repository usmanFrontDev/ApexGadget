import type { ProductFilterInput } from '@/types/shop.types'

/** Every selected filter value lives in the URL as `f.<ProductFilter type>[.<qualifier>]=<value>`. */
export const FILTER_PARAM_PREFIX = 'f.'

interface UrlPair {
  key: string
  value: string
}

const isNonEmpty = (value: string | undefined): value is string => Boolean(value && value.trim())

/** `ProductFilter` input -> URL param. Generic: no filter is special-cased by name. */
export function inputToUrl(input: ProductFilterInput): UrlPair {
  if ('available' in input) return { key: 'f.available', value: String(input.available) }
  if ('price' in input) {
    return { key: 'f.price', value: `${input.price.min ?? ''}-${input.price.max ?? ''}` }
  }
  if ('productType' in input) return { key: 'f.productType', value: input.productType }
  if ('productVendor' in input) return { key: 'f.productVendor', value: input.productVendor }
  if ('category' in input) return { key: 'f.category', value: input.category.id }
  if ('variantOption' in input) {
    return { key: `f.variantOption.${input.variantOption.name}`, value: input.variantOption.value }
  }
  if ('productMetafield' in input) {
    const { namespace, key, value } = input.productMetafield
    return { key: `f.productMetafield.${namespace}.${key}`, value }
  }
  const { namespace, key, value } = input.variantMetafield
  return { key: `f.variantMetafield.${namespace}.${key}`, value }
}

function parseMetafield(rest: string, value: string) {
  const dot = rest.indexOf('.')
  if (dot <= 0 || dot === rest.length - 1) return undefined
  return { namespace: rest.slice(0, dot), key: rest.slice(dot + 1), value }
}

/** URL param -> `ProductFilter` input. Unknown or malformed params return `undefined`. */
export function urlToInput(paramKey: string, value: string): ProductFilterInput | undefined {
  if (!paramKey.startsWith(FILTER_PARAM_PREFIX) || !isNonEmpty(value)) return undefined
  const path = paramKey.slice(FILTER_PARAM_PREFIX.length)
  const dot = path.indexOf('.')
  const type = dot === -1 ? path : path.slice(0, dot)
  const rest = dot === -1 ? '' : path.slice(dot + 1)

  switch (type) {
    case 'available':
      return value === 'true' || value === 'false' ? { available: value === 'true' } : undefined
    case 'price': {
      const match = /^(\d*\.?\d*)-(\d*\.?\d*)$/.exec(value)
      if (!match || (!match[1] && !match[2])) return undefined
      const min = match[1] ? Number(match[1]) : undefined
      const max = match[2] ? Number(match[2]) : undefined
      return { price: { ...(min !== undefined && { min }), ...(max !== undefined && { max }) } }
    }
    case 'productType':
      return { productType: value }
    case 'productVendor':
      return { productVendor: value }
    case 'category':
      return { category: { id: value } }
    case 'variantOption':
      return isNonEmpty(rest) ? { variantOption: { name: rest, value } } : undefined
    case 'productMetafield': {
      const metafield = parseMetafield(rest, value)
      return metafield ? { productMetafield: metafield } : undefined
    }
    case 'variantMetafield': {
      const metafield = parseMetafield(rest, value)
      return metafield ? { variantMetafield: metafield } : undefined
    }
    default:
      return undefined
  }
}

/** Filter kind (URL key without the value): values of the same kind OR together, kinds AND. */
export const groupKey = (input: ProductFilterInput) => inputToUrl(input).key

export function inputId(input: ProductFilterInput) {
  const { key, value } = inputToUrl(input)
  return `${key}=${value}`
}

export const sameInput = (a: ProductFilterInput, b: ProductFilterInput) => inputId(a) === inputId(b)

/** Reads every `f.*` param (duplicates removed, malformed ones ignored). */
export function parseSelection(params: URLSearchParams): ProductFilterInput[] {
  const selection: ProductFilterInput[] = []
  for (const [key, value] of params.entries()) {
    const input = urlToInput(key, value)
    if (input && !selection.some((existing) => sameInput(existing, input))) selection.push(input)
  }
  return selection
}

/** Replaces the `f.*` params of `params` with `selection`. */
export function writeSelection(params: URLSearchParams, selection: readonly ProductFilterInput[]) {
  for (const key of [...params.keys()]) {
    if (key.startsWith(FILTER_PARAM_PREFIX)) params.delete(key)
  }
  for (const input of selection) {
    const { key, value } = inputToUrl(input)
    params.append(key, value)
  }
}

/** Sorted, de-duplicated copy: the same selection always gives the same query key. */
export function normalizeSelection(selection: readonly ProductFilterInput[]): ProductFilterInput[] {
  const unique = new Map(selection.map((input) => [inputId(input), input]))
  return [...unique.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, input]) => input)
}

/** Adds the value, or removes it when already selected. A price range replaces the previous one. */
export function toggleInput(
  selection: readonly ProductFilterInput[],
  input: ProductFilterInput,
): ProductFilterInput[] {
  if (selection.some((item) => sameInput(item, input))) {
    return selection.filter((item) => !sameInput(item, input))
  }
  return 'price' in input
    ? [...selection.filter((item) => !('price' in item)), input]
    : [...selection, input]
}

export function getSelectedPrice(selection: readonly ProductFilterInput[]) {
  const found = selection.find((item): item is { price: { min?: number; max?: number } } => 'price' in item)
  return found?.price
}

export function setPrice(
  selection: readonly ProductFilterInput[],
  min?: number,
  max?: number,
): ProductFilterInput[] {
  const rest = selection.filter((item) => !('price' in item))
  return min === undefined && max === undefined
    ? rest
    : [...rest, { price: { ...(min !== undefined && { min }), ...(max !== undefined && { max }) } }]
}

/** Shop lists available products unless the shopper picked an availability value. */
export function withDefaultAvailability(selection: readonly ProductFilterInput[]): ProductFilterInput[] {
  return selection.some((item) => 'available' in item)
    ? [...selection]
    : [...selection, { available: true }]
}

/** Parses the JSON string the Storefront API puts in `FilterValue.input`; invalid -> `undefined`. */
export function parseFilterInput(json: string): ProductFilterInput | undefined {
  let data: unknown
  try {
    data = JSON.parse(json)
  } catch {
    return undefined
  }
  if (!data || typeof data !== 'object') return undefined
  const record = data as Record<string, unknown>
  const text = (value: unknown) => (typeof value === 'string' && value ? value : undefined)
  const number = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : undefined)

  if (typeof record.available === 'boolean') return { available: record.available }
  if (record.price && typeof record.price === 'object') {
    const price = record.price as Record<string, unknown>
    const min = number(price.min)
    const max = number(price.max)
    return min === undefined && max === undefined
      ? undefined
      : { price: { ...(min !== undefined && { min }), ...(max !== undefined && { max }) } }
  }
  if (text(record.productType)) return { productType: record.productType as string }
  if (text(record.productVendor)) return { productVendor: record.productVendor as string }
  if (record.category && typeof record.category === 'object') {
    const id = text((record.category as Record<string, unknown>).id)
    return id ? { category: { id } } : undefined
  }
  if (record.variantOption && typeof record.variantOption === 'object') {
    const option = record.variantOption as Record<string, unknown>
    const name = text(option.name)
    const value = text(option.value)
    return name && value ? { variantOption: { name, value } } : undefined
  }
  for (const type of ['productMetafield', 'variantMetafield'] as const) {
    const raw = record[type]
    if (raw && typeof raw === 'object') {
      const field = raw as Record<string, unknown>
      const namespace = text(field.namespace)
      const key = text(field.key)
      const value = text(field.value)
      if (namespace && key && value) return { [type]: { namespace, key, value } } as ProductFilterInput
      return undefined
    }
  }
  return undefined
}

/**
 * Drops selected values whose whole filter kind is no longer offered by Shopify (e.g. the client
 * removed that filter in Search & Discovery), so a stale URL never leaves a ghost chip or an empty result.
 */
export function dropStaleSelection(
  selection: readonly ProductFilterInput[],
  offeredKinds: ReadonlySet<string>,
): ProductFilterInput[] {
  return selection.filter((input) => offeredKinds.has(groupKey(input)))
}
