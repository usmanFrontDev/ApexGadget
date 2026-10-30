import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  DEFAULT_CATEGORY,
  DEFAULT_SEARCH_SORT,
  DEFAULT_SORT,
  ProductSortKey,
  SEARCH_SORT_OPTIONS,
  SORT_OPTIONS,
  ShopCategoryId,
  ShopParam,
} from '@/constants/shop'
import { METAFIELD_NAMESPACE, ProductMetafield } from '@/constants/shopify'
import { parseSelection, setPrice, toggleInput, writeSelection } from '@/lib/shopFilters'
import type { ProductFilterInput, ShopQuery } from '@/types/shop.types'

const isOneOf = <T extends string>(values: readonly T[], value: string | null): value is T =>
  value !== null && (values as readonly string[]).includes(value)

/** Sort keys Shopify supports for this source (collections vs search). */
export const getSortOptions = (search: string) => (search.trim() ? SEARCH_SORT_OPTIONS : SORT_OPTIONS)

function parseQuery(params: URLSearchParams): ShopQuery {
  const category = params.get(ShopParam.Category)
  const sort = params.get(ShopParam.Sort)
  const search = params.get(ShopParam.Search)?.trim() ?? ''
  const options = getSortOptions(search)

  return {
    category: isOneOf(Object.values(ShopCategoryId), category) ? category : DEFAULT_CATEGORY,
    sort: options.some((option) => option.value === sort)
      ? (sort as ProductSortKey)
      : search
        ? DEFAULT_SEARCH_SORT
        : DEFAULT_SORT,
    search,
    selection: parseSelection(params),
  }
}

function serializeQuery(query: ShopQuery) {
  const params = new URLSearchParams()
  if (query.category !== DEFAULT_CATEGORY) params.set(ShopParam.Category, query.category)
  if (query.search) params.set(ShopParam.Search, query.search)
  const defaultSort = query.search ? DEFAULT_SEARCH_SORT : DEFAULT_SORT
  if (query.sort !== defaultSort) params.set(ShopParam.Sort, query.sort)
  writeSelection(params, query.selection)
  return params
}

/** Shop category, search, sort and filters live in the URL, so they're shareable and survive refresh / back. */
export function useShopFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = useMemo(() => parseQuery(searchParams), [searchParams])

  const update = useCallback(
    (patch: (current: ShopQuery) => Partial<ShopQuery>) => {
      setSearchParams(
        (previous) => {
          const current = parseQuery(previous)
          return serializeQuery({ ...current, ...patch(current) })
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  /** Category change starts from a clean slate (filters differ per category). */
  const setCategory = useCallback(
    (category: ShopCategoryId) => update(() => ({ category, selection: [] })),
    [update],
  )

  /** Quick-select pill: a category, optionally with one model selected. */
  const selectPill = useCallback(
    (category: ShopCategoryId, model?: string) =>
      update(() => ({
        category,
        selection: model
          ? [{ productMetafield: { namespace: METAFIELD_NAMESPACE, key: ProductMetafield.DeviceModel, value: model } }]
          : [],
      })),
    [update],
  )

  const toggleFilter = useCallback(
    (input: ProductFilterInput) => update((current) => ({ selection: toggleInput(current.selection, input) })),
    [update],
  )

  const setPriceRange = useCallback(
    (min?: number, max?: number) => update((current) => ({ selection: setPrice(current.selection, min, max) })),
    [update],
  )

  /** Used to drop selections Shopify no longer offers. */
  const replaceSelection = useCallback(
    (selection: ProductFilterInput[]) => update(() => ({ selection })),
    [update],
  )

  const setSort = useCallback((sort: ProductSortKey) => update(() => ({ sort })), [update])
  const clearFilters = useCallback(() => update(() => ({ selection: [] })), [update])

  return {
    query,
    activeFilterCount: query.selection.length,
    setCategory,
    selectPill,
    toggleFilter,
    setPriceRange,
    replaceSelection,
    setSort,
    clearFilters,
  }
}

export type ShopFiltersState = ReturnType<typeof useShopFilters>
