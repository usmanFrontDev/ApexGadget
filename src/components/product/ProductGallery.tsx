import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { Chip } from '@/components/ui/Chip'
import { GlassCard } from '@/components/ui/GlassCard'
import { IconButton } from '@/components/ui/IconButton'
import { ChipSize, ChipVariant, GlassCardVariant, IconButtonSize } from '@/constants/ui'
import { cn } from '@/lib/cn'
import type { ProductImage } from '@/types/product.types'

export interface ProductGalleryProps {
  images: readonly ProductImage[]
  title: string
  /** Text of the chip on the picture (grade, or "Sold"). */
  badge?: string
  sold?: boolean
  /** Shown under the main picture, in the same column (e.g. the key-spec strip), so the edges line up. */
  below?: ReactNode
}

const SWIPE_THRESHOLD_PX = 40

/**
 * Product pictures: a big image (arrows, dots, swipe) and thumbnails (a vertical rail from lg, a row below).
 * The frame has a fixed aspect ratio, so switching pictures never shifts the layout.
 */
export function ProductGallery({ images, title, badge, sold = false, below }: ProductGalleryProps) {
  const [index, setIndex] = useState(0)
  const startX = useRef<number | null>(null)
  const count = images.length
  const current = images[Math.min(index, count - 1)]
  const many = count > 1

  const go = (next: number) => setIndex((next + count) % count)

  const onPointerDown = (event: PointerEvent) => {
    startX.current = event.clientX
  }
  const onPointerUp = (event: PointerEvent) => {
    if (startX.current === null || !many) return
    const delta = event.clientX - startX.current
    startX.current = null
    if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) go(index + (delta < 0 ? 1 : -1))
  }

  /** Thumbnail buttons; `vertical` = the rail inside the picture (desktop), otherwise the row under it. */
  const renderThumbs = (vertical: boolean) => (
    <ul
      className={cn('scrollbar-none flex gap-2.5', vertical ? 'max-h-full flex-col overflow-y-auto' : 'overflow-x-auto')}
      aria-label={`${title} photos`}
    >
      {images.map((image, imageIndex) => (
        <li key={`${image.url}-${imageIndex}`} className="shrink-0">
          <button
            type="button"
            onClick={() => setIndex(imageIndex)}
            aria-label={`Show photo ${imageIndex + 1} of ${count}`}
            aria-current={imageIndex === index}
            className={cn(
              'block overflow-hidden rounded-2xl bg-white p-1.5 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              vertical ? 'size-14' : 'size-[62px]',
              imageIndex === index ? 'shadow-ring-selected' : 'opacity-70 shadow-ring hover:opacity-100',
            )}
          >
            <img src={image.url} alt="" loading="lazy" className="size-full object-contain" />
          </button>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="flex flex-col gap-3 lg:h-full lg:gap-4">
      {/* phones / tablets: thumbnails in a row under the picture */}
      {many && <div className="order-2 min-w-0 lg:hidden">{renderThumbs(false)}</div>}

      <GlassCard
        variant={GlassCardVariant.Soft}
        className="relative order-1 flex min-w-0 flex-col rounded-[24px] lg:flex-1"
      >
        {/* desktop: the thumbnails sit INSIDE the picture, on its left edge and vertically centred, so the picture and the
            thumbnails are always on screen together, however tall the card is */}
        {many && (
          <div className="absolute inset-y-16 left-4 z-10 hidden items-center lg:flex">
            <div className="max-h-full rounded-[20px] bg-white/70 p-1.5 shadow-ring backdrop-blur-sm">{renderThumbs(true)}</div>
          </div>
        )}

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label={`${title} photos`}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (startX.current = null)}
          className="relative aspect-square touch-pan-y select-none overflow-hidden sm:aspect-[5/4] lg:aspect-auto lg:min-h-[360px] lg:flex-1"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_closest-side,rgb(200_32_40/0.12),transparent_92%)]"
          />
          {current ? (
            <img
              src={current.url}
              alt={current.alt}
              width={current.width}
              height={current.height}
              draggable={false}
              // extra room on top: the badge sits in the corner and must never cover the picture
              className={cn(
                'relative size-full object-contain px-8 pb-8 pt-16 sm:px-10 sm:pb-10 lg:pl-28',
                sold && 'opacity-60 grayscale',
              )}
            />
          ) : (
            <span className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#e9e9eb_0_7px,#f1f1f3_7px_13px)]" />
          )}

          {badge && (
            <Chip size={ChipSize.Sm} variant={ChipVariant.Tint} className="absolute left-4 top-4">
              {badge}
            </Chip>
          )}

        </div>

        {/* prev / dots / next on one line under the picture (same place on every screen size) */}
        {many && (
          <div className="flex items-center justify-center gap-3 pb-4 pt-1">
            <IconButton label="Previous photo" size={IconButtonSize.Sm} onClick={() => go(index - 1)}>
              <ChevronLeftIcon />
            </IconButton>
            <div className="flex gap-1.5" aria-hidden="true">
              {images.map((image, dotIndex) => (
                <span
                  key={`${image.url}-${dotIndex}`}
                  className={cn('size-1.5 rounded-full transition-colors', dotIndex === index ? 'bg-primary' : 'bg-ink/20')}
                />
              ))}
            </div>
            <IconButton label="Next photo" size={IconButtonSize.Sm} onClick={() => go(index + 1)}>
              <ChevronRightIcon />
            </IconButton>
          </div>
        )}
      </GlassCard>

      {below && <div className="order-3 min-w-0">{below}</div>}
    </div>
  )
}
