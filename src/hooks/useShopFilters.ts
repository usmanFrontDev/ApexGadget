import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  DEFAULT_CATEGORY,
  DEFAULT_SORT,
  ProductSortKey,
  SHOP_FACETS,
  ShopCategoryId,
  ShopParam,
  type FacetKey,
} from '@/constants/shop'
import type { FacetSelections, ShopFilters } from '@/types/shop.types'

const isOneOf = <T extends string>(values: readonly T[], value: string | null): value is T =>
  value !== null && (values as readonly string[]).includes(value)

const toNumber = (value: string | null) => {
  if (value === null || value.trim() === '') return undefined
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : undefined
}

const emptyFacets = (): FacetSelections => ({
  models: [],
  storages: [],
  conditions: [],
  batteryRanges: [],
  colors: [],
})

function parseFilters(params: URLSearchParams): ShopFilters {
  const category = params.get(ShopParam.Category)
  const sort = params.get(ShopParam.Sort)
  const page = Number(params.get(ShopParam.Page))

  const facets = emptyFacets()
  for (const { key, param, options } of SHOP_FACETS) {
    const allowed = options.map((option) => option.value)
    facets[key] = params.getAll(param).filter((value) => allowed.includes(value))
  }

  return {
    category: isOneOf(Object.values(ShopCategoryId), category) ? category : DEFAULT_CATEGORY,
    facets,
    minPrice: toNumber(params.get(ShopParam.MinPrice)),
    maxPrice: toNumber(params.get(ShopParam.MaxPrice)),
    sort: isOneOf(Object.values(ProductSortKey), sort) ? sort : DEFAULT_SORT,
    page: Number.isInteger(page) && page > 1 ? page : 1,
    search: params.get(ShopParam.Search) ?? '',
  }
}

function serializeFilters(filters: ShopFilters) {
  const params = new URLSearchParams()
  if (filters.category !== DEFAULT_CATEGORY) params.set(ShopParam.Category, filters.category)
  for (const { key, param } of SHOP_FACETS) {
    filters.facets[key].forEach((value) => params.append(param, value))
  }
  if (filters.minPrice !== undefined) params.set(ShopParam.MinPrice, String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.set(ShopParam.MaxPrice, String(filters.maxPrice))
  if (filters.sort !== DEFAULT_SORT) params.set(ShopParam.Sort, filters.sort)
  if (filters.page > 1) params.set(ShopParam.Page, String(filters.page))
  if (filters.search.trim()) params.set(ShopParam.Search, filters.search.trim())
  return params
}

/** Shop filters live in the URL, so they're shareable and survive refresh / back. */
export function useShopFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseFilters(searchParams), [searchParams])

  /** Applies a patch; any change except `page` itself sends you back to page 1. */
  const update = useCallback(
    (patch: Partial<ShopFilters>) => {
      setSearchParams(
        (previous) => {
          const current = parseFilters(previous)
          return serializeFilters({ ...current, page: 1, ...patch })
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setCategory = useCallback(
    (category: ShopCategoryId) =>
      update({ category, facets: emptyFacets(), minPrice: undefined, maxPrice: undefined }),
    [update],
  )

  /** Quick-select a single model (or none) inside a category. */
  const selectModel = useCallback(
    (category: ShopCategoryId, model?: string) =>
      update({
        category,
        facets: { ...emptyFacets(), models: model ? [model] : [] },
        minPrice: undefined,
        maxPrice: undefined,
      }),
    [update],
  )

  const toggleFacet = useCallback(
    (key: FacetKey, value: string) => {
      const current = parseFilters(searchParams).facets
      const selected = current[key]
      update({
        facets: {
          ...current,
          [key]: selected.includes(value)
            ? selected.filter((item) => item !== value)
            : [...selected, value],
        },
      })
    },
    [searchParams, update],
  )

  const setSort = useCallback((sort: ProductSortKey) => update({ sort }), [update])
  const setPage = useCallback((page: number) => update({ page }), [update])
  const setPriceRange = useCallback(
    (min?: number, max?: number) => update({ minPrice: min, maxPrice: max }),
    [update],
  )
  const clearFilters = useCallback(
    () => update({ facets: emptyFacets(), minPrice: undefined, maxPrice: undefined, search: '' }),
    [update],
  )

  const activeFilterCount =
    Object.values(filters.facets).reduce((sum, values) => sum + values.length, 0) +
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0)

  return {
    filters,
    activeFilterCount,
    setCategory,
    selectModel,
    toggleFacet,
    setSort,
    setPage,
    setPriceRange,
    clearFilters,
  }
}
