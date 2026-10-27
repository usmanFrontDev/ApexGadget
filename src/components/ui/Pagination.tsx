import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { cn } from '@/lib/cn'

export interface PaginationProps {
  page: number
  pageCount: number
  onChange: (page: number) => void
}

const ELLIPSIS = 'ellipsis'

/** 1 … 4 5 6 … 12 */
function getPageItems(page: number, pageCount: number): (number | typeof ELLIPSIS)[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const items: (number | typeof ELLIPSIS)[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)
  if (start > 2) items.push(ELLIPSIS)
  for (let current = start; current <= end; current++) items.push(current)
  if (end < pageCount - 1) items.push(ELLIPSIS)
  items.push(pageCount)
  return items
}

const circle =
  'inline-flex size-9 items-center justify-center rounded-full text-[13px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) return null

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={cn(circle, 'bg-white/92 shadow-ring hover:bg-white disabled:pointer-events-none disabled:opacity-40')}
      >
        <ChevronLeftIcon />
      </button>

      {getPageItems(page, pageCount).map((item, index) =>
        item === ELLIPSIS ? (
          <span key={`${ELLIPSIS}-${index}`} aria-hidden="true" className="px-1 text-ink/40">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
            className={cn(
              circle,
              item === page
                ? 'bg-primary text-white shadow-primary-soft'
                : 'bg-white/92 text-ink shadow-ring hover:bg-white',
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
        className={cn(circle, 'bg-white/92 shadow-ring hover:bg-white disabled:pointer-events-none disabled:opacity-40')}
      >
        <ChevronRightIcon />
      </button>
    </nav>
  )
}
