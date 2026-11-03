import { useState } from 'react'
import { TextInput } from '@/components/form/TextInput'
import { CloseIcon, SearchIcon } from '@/components/icons'
import { SHOP_SEARCH_DEBOUNCE_MS, SHOP_SEARCH_MAX_LENGTH } from '@/constants/shop'
import { useDebouncedCommit } from '@/hooks/useDebouncedCommit'
import { cn } from '@/lib/cn'

export interface ShopSearchFieldProps {
  /** The `q` of the URL. */
  value: string
  onSearch: (value: string) => void
  className?: string
}

/** Product search of the shop toolbar: typing updates the URL after a short pause, Enter right away, X clears. */
export function ShopSearchField({ value, onSearch, className }: ShopSearchFieldProps) {
  const [draft, setDraft] = useState(value)
  const [syncedValue, setSyncedValue] = useState(value)

  // The URL changed elsewhere (a category pill, "Clear all"): follow it.
  if (value !== syncedValue) {
    setSyncedValue(value)
    setDraft(value)
  }

  useDebouncedCommit(draft.trim(), onSearch, SHOP_SEARCH_DEBOUNCE_MS)

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        onSearch(draft.trim())
      }}
      className={cn('relative', className)}
    >
      <label htmlFor="shop-search" className="sr-only">
        Search products
      </label>
      <SearchIcon aria-hidden="true" width={18} height={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/55" />
      <TextInput
        id="shop-search"
        type="search"
        value={draft}
        maxLength={SHOP_SEARCH_MAX_LENGTH}
        placeholder="Search products"
        autoComplete="off"
        enterKeyHint="search"
        onChange={(event) => setDraft(event.target.value)}
        className="h-10 rounded-full pl-11 pr-10 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {draft && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setDraft('')
            onSearch('')
          }}
          className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-ink/60 transition hover:bg-ink/6 hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
        >
          <CloseIcon width={13} height={13} />
        </button>
      )}
    </form>
  )
}
