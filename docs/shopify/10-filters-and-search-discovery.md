# 10 — Server-side filters and Search & Discovery

Filtering, sorting and pagination of the shop page and of search are done **by Shopify**. The app renders the filter
groups the API returns; it never hardcodes a facet list in a component. The client controls which filters exist,
their order and their labels in the **Shopify Search & Discovery** app.

## 1. What is verified (shopify.dev, checked 2026-10-30)

- `collection(handle).products(filters:, sortKey:, reverse:, first:, after:)` accepts `ProductFilter` inputs: `available`, `price {min,max}`, `productType`, `productVendor`, `variantOption {name,value}`, `productMetafield {namespace,key,value}`, `variantMetafield`, `category {id}`. Different filter types combine with **AND**; several values of the same type combine with **OR**. Only the first `price` range is applied. Max 250 filter values. ([filter products guide](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/filter-products))
- The same connection returns `filters { id label type values { id label count input } }`. `type` is `LIST` or `PRICE_RANGE` (documented). `input` is a **JSON string** you pass back as a `ProductFilter`.
- `search(query, productFilters:, sortKey:, types:)` also takes `[ProductFilter!]` and returns `productFilters` (the available filters) plus `totalCount` (**capped at 1,000**). ([search](https://shopify.dev/docs/api/storefront/latest/queries/search))
- Availability and price filters are on by default in Search & Discovery; **product type, vendor and category must be enabled** under Search & Discovery → Filters.
- Metafield filters work for `single_line_text_field`, `boolean`, `number_integer`, `number_decimal` (API ≥ 2022-04).
- Search & Discovery limits: **25 filters per store**, a filter shows up to **100 values**, collections with **> 5,000 products show no filters**, search filter counts are based on the **first 1,000 results**. Filters apply to collections and to search. ([help](https://help.shopify.com/en/manual/online-store/search-and-discovery/filters))
- `Collection` has **no product-count field** in the Storefront API (field list checked). `productRecommendations` returns up to 10 products (`RELATED` auto; `COMPLEMENTARY` needs manual setup in Search & Discovery).

## 2. Not verified (treat as unknown until tested on a dev store) — see OPEN-ISSUES U-list
- Exact format of `filter.id` / `value.id` for metafield filters (Online Store uses `filter.p.m.custom.storage`; the Storefront API ids may differ). **The app therefore never depends on ids**: it stores and sends `ProductFilter` inputs (§5).
- Shape of the `PRICE_RANGE` value `input` (expected `{"price":{"min":0,"max":<max>}}`).
- Whether counts are "disjunctive" (a group's counts ignore its own selection) or conjunctive.
- Numeric **range** filtering on integer metafields — **assume it does NOT work**; that is why `custom.battery_bucket` (text) exists.
- `ProductCollectionSortKeys` / `SearchSortKeys` exact values (expected: collection `COLLECTION_DEFAULT, BEST_SELLING, CREATED, PRICE, TITLE, MANUAL, ID, RELEVANCE`; search `RELEVANCE, PRICE`).
- Whether a `filters` entry for a metafield disappears when the definition is not filterable, and what the API does with a filter input for a disabled filter.

## 3. One-time setup (client, admin)

1. **Collections** (Products → Collections), all with condition type *Smart*:
   | Handle | Title | Condition |
   |---|---|---|
   | `all-products` | All products | Price is greater than 0 |
   | `iphones` | iPhones | Product type is equal to `iPhones` |
   | `audio` | Audio | Product type is equal to `Audio` |
   | `wearables` | Wearables | Product type is equal to `Wearables` |
   | `chargers` | Chargers | Product type is equal to `Chargers` |
   | `cases` | Cases | Product type is equal to `Cases` |
   | `accessories` | All accessories | Product type is not equal to `iPhones` |
   | `bestsellers` | Bestsellers | Manual, curated order (home page) |
   | `new-arrivals` | New arrivals | Smart: created in the last 14 days (optional) |
   Each must be published to the **Headless** channel and stay under 5,000 products.
2. **Metafield definitions** must exist (02 §3) with **Storefront access ON**, and the filterable ones must be added in the next step.
3. Open **Search & Discovery → Filters → Add filter**, in this order (drag to reorder later). Launch set = 9 of the 25 allowed:

   | # | S&D source | Suggested label | Applies to | Backing field |
   |---|---|---|---|---|
   | 1 | Availability | Availability | all | native |
   | 2 | Price | Price | all | native |
   | 3 | Product type | Category | `all-products`, `accessories`, search | `productType` |
   | 4 | Product metafield `custom.device_model` | Model | iPhones | single_line_text |
   | 5 | Product metafield `custom.storage` | Storage | iPhones | single_line_text |
   | 6 | Product metafield `custom.pta_status` | PTA status | iPhones | single_line_text |
   | 7 | Product metafield `custom.battery_bucket` | Battery health | iPhones | single_line_text |
   | 8 | Product metafield `custom.color` | Color | iPhones | single_line_text |
   | 9 | Product metafield `custom.condition_grade` | Condition | all | single_line_text |

   (S&D applies one filter list to all collections/search; a group simply has no values — and is not returned or has count 0 — where no product has the field. The UI hides groups without any value.)
4. Customize each filter's **values display** (e.g. rename `non-pta` → "Non-PTA", `natural-titanium` → "Natural Titanium") if the app lets you; otherwise the app's label map (§6) does it.
5. Confirm in the dev store with the audit: `yarn shopify:audit` prints every `filters` group of `all-products` and fails if one of the nine is missing.

### Add / remove / reorder / rename a filter later (no code change)
| Goal | Steps |
|---|---|
| Remove a filter | S&D → Filters → open it → Delete. It disappears from the site on the next request. |
| Reorder | S&D → Filters → drag. The site follows the order of the API. |
| Rename a group | S&D → Filters → open → Label. |
| Add a filter from an existing field | S&D → Add filter → pick the source. Appears automatically (label from the API; values shown prettified, §6). |
| Add a filter from a **new** attribute | 1) Settings → Custom data → Products → add the metafield definition (type text/integer/decimal/boolean, **Storefront access ON**). 2) Fill it on the products (bulk editor). 3) S&D → add filter. 4) Update 02 + mock fixture + (optional) label map. No component change. |

Fields that can become filters: product options (Color, Size…), product/variant metafields of type single line text (also list), integer, decimal, true/false, metaobject reference (list); product type, vendor, tags, category, availability, price. **Not** rich text, JSON, dates, files.

## 4. Behaviour of the shop page

| Situation | Query |
|---|---|
| `/shop?category=audio` | `collection(handle:"audio").products(filters, sortKey, first:12)` |
| `/shop` (no category) | default category `iphones` (current `DEFAULT_CATEGORY`) |
| `/shop?category=all` | `all-products` |
| `/shop?q=airpods` | `search(query, productFilters, types:[PRODUCT])` — the `category` param is ignored; the *Category* (product type) filter narrows |
| Sort Featured | `COLLECTION_DEFAULT` (manual order; a new store has no sales) |
| Sort Newest | `CREATED`, `reverse:true` (collections only) |
| Sort Price | `PRICE`, `reverse` for high→low (collections and search) |
| Sort Name A–Z | `TITLE` (collections only) |
| Search sorts | Relevance (default) and Price only; unsupported options are hidden on search |
| Default availability | the shop applies `available: true` unless the shopper picks the Availability filter's "Sold"/out-of-stock value (sold listings stay reachable by URL, see 03) |
| Pagination | cursor-based **Load more** (`first:12` (= `SHOP_PAGE_SIZE`), `after`). Numbered pages and "page X of Y" are not possible without a total count (OPEN-ISSUES). |
| Result count | `search.totalCount` (≤1,000); for collections the sum of the Availability filter's value counts when that filter exists; otherwise hidden |

## 5. URL encoding (generic, independent of filter ids)

Every selected value is stored as the `ProductFilter` input it represents:

| URL param | `ProductFilter` | Example |
|---|---|---|
| `f.available=true` | `{available:true}` | |
| `f.productType=Audio` | `{productType:"Audio"}` | repeated key = OR |
| `f.productVendor=Apple` | `{productVendor:"Apple"}` | |
| `f.variantOption.<Name>=<Value>` | `{variantOption:{name,value}}` | `f.variantOption.Color=Black` |
| `f.productMetafield.<ns>.<key>=<value>` | `{productMetafield:{namespace,key,value}}` | `f.productMetafield.custom.storage=256gb&f.productMetafield.custom.storage=512gb` |
| `f.variantMetafield.<ns>.<key>=<value>` | `{variantMetafield:{…}}` | |
| `f.price=<min>-<max>` | `{price:{min,max}}` (either side optional) | `f.price=100000-400000` |
| `f.category=<gid>` | `{category:{id}}` | |

Other params: `category`, `sort` (`featured, newest, price-asc, price-desc, title-asc, relevance`), `q`. No `page` (cursor load-more only).

Rules
- `serializeFilters(selection) -> URLSearchParams` and `parseFilters(params) -> ProductFilterInput[]` are pure, tested and shared by the mock and Shopify services. Unknown `f.*` shapes are ignored.
- **Highlighting selection:** the UI marks a `FilterValue` selected when its `input` (parsed JSON, key-order independent) equals a selected input.
- **Stale filters:** after each response, selections that match no returned `FilterValue` are dropped from the URL (`replace`), so a removed filter never leaves a ghost chip or an empty result.
- The query key is the normalised (sorted) selection → React Query caches each combination; `placeholderData: keepPreviousData` avoids flicker; prefetch the next cursor on idle.
- Filtered/sorted URLs are `noindex` with a canonical pointing to the unfiltered category (09).

## 6. Types and labels

```ts
export type ProductFilterInput =
  | { available: boolean }
  | { price: { min?: number; max?: number } }
  | { productType: string }
  | { productVendor: string }
  | { variantOption: { name: string; value: string } }
  | { productMetafield: { namespace: string; key: string; value: string } }
  | { variantMetafield: { namespace: string; key: string; value: string } }
  | { category: { id: string } }

export interface FilterValue {
  id: string            // from the API; only used as a React key
  label: string         // API label, prettified by labelFor()
  count: number
  input: ProductFilterInput   // parsed from the API's JSON string
  urlKey: string        // e.g. 'f.productMetafield.custom.storage'
  urlValue: string      // e.g. '256gb'
}
export interface FilterGroup {
  id: string
  label: string         // from Search & Discovery
  type: 'LIST' | 'PRICE_RANGE'
  values: FilterValue[]
  priceBounds?: { min: number; max: number }   // PRICE_RANGE only
}
```

Labels: group label = API `label`. Value label = `labelFor(group, value)`: (1) `FILTER_VALUE_LABELS[urlValue]` if known (e.g. `pta`→"PTA Approved", `non-pta`→"Non-PTA", `jv`→"JV", `90-100`→"90% – 100%", `below-70`→"Below 70%", `natural-titanium`→"Natural Titanium", `very-good`→"Very Good", `256gb`→"256 GB"); (2) otherwise the API label humanised (`-`/`_`→space, Title Case, `gb`/`tb` upper-cased). Unknown values therefore **always render** (no silent drop). Colour swatches: `FILTER_SWATCHES[urlValue]` (a dot is shown only when known). `ShopModelId`, `ProductColor`… enums stay only for these maps and for mapper typing; they never gate what is shown.

## 7. Mock service
`queryMockShop(query, after)` (`src/services/mock/shopMock.ts`) filters `MOCK_PRODUCTS` with a pure engine that returns the **same** `{ products, filters: FilterGroup[], pageInfo, totalCount? }` shape, building groups from the mock fields (Availability, Price, Category, Model, Storage, PTA status, Battery health, Color, Condition) with counts. The UI cannot tell the difference. The old client-side catalogue (`useCatalog`, `lib/shopCatalog.ts`, `SHOP_FACETS`) was removed in Phase B step 3.
