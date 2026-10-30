import type { ReactNode } from 'react'
import { CheckIcon, PhoneIcon, ShieldIcon, StarIcon } from '@/components/icons'
import { Typography } from '@/components/ui/Typography'
import { PRODUCT_CONTENT } from '@/constants/product'
import { TypographyVariant } from '@/constants/ui'
import { BatteryTone, getBatteryTone } from '@/lib/battery'
import { labelFor } from '@/lib/filterLabels'
import type { ProductDetail } from '@/types/product.types'

/** Ring colour by battery health (full class names so Tailwind generates them). */
const RING_STROKE_CLASS: Record<BatteryTone, string> = {
  [BatteryTone.Good]: 'stroke-emerald-500',
  [BatteryTone.Fair]: 'stroke-amber-500',
  [BatteryTone.Low]: 'stroke-primary',
}

const RING_SIZE = 44
const RING_STROKE = 5
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

/** Round gauge of a percentage (the number is shown next to it, so the ring is decorative). */
function BatteryRing({ health }: { health: number }) {
  const filled = (Math.min(Math.max(health, 0), 100) / 100) * RING_LENGTH
  const center = RING_SIZE / 2
  return (
    <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} aria-hidden="true" className="shrink-0 -rotate-90">
      <circle cx={center} cy={center} r={RING_RADIUS} fill="none" strokeWidth={RING_STROKE} className="stroke-ink/10" />
      <circle
        cx={center}
        cy={center}
        r={RING_RADIUS}
        fill="none"
        strokeWidth={RING_STROKE}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${RING_LENGTH}`}
        className={RING_STROKE_CLASS[getBatteryTone(health)]}
      />
    </svg>
  )
}

function Tile({ visual, label, children }: { visual: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-2xl bg-ink/[0.035] px-3 py-2.5 sm:gap-3 sm:px-3.5">
      <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center text-ink/60">
        {visual}
      </span>
      <div className="min-w-0">
        <dt className="truncate font-body text-[12px] text-ink/55">{label}</dt>
        <dd className="truncate text-[15px] font-bold leading-tight">{children}</dd>
      </div>
    </div>
  )
}

/**
 * What the buyer is getting: four equal tiles (battery, condition, network, warranty) and the box contents.
 * No card of its own: it sits inside the buy box, above the buttons. Only tiles with data are shown.
 */
export function ConditionReport({ product }: { product: ProductDetail }) {
  const { report } = PRODUCT_CONTENT
  const hasTiles =
    product.batteryHealth !== undefined || product.grade || product.ptaStatus || product.warrantyMonths !== undefined
  if (!hasTiles && product.boxContents.length === 0) return null

  return (
    <section aria-label={report.title} className="flex flex-col gap-3.5">
      <Typography variant={TypographyVariant.CardTitle}>{report.title}</Typography>

      {hasTiles && (
        <dl className="grid grid-cols-2 gap-2.5">
          {product.batteryHealth !== undefined && (
            <Tile visual={<BatteryRing health={product.batteryHealth} />} label={report.battery}>
              <span role="meter" aria-label={report.battery} aria-valuemin={0} aria-valuemax={100} aria-valuenow={product.batteryHealth}>
                {product.batteryHealth}%
              </span>
            </Tile>
          )}
          {product.grade && (
            <Tile visual={<StarIcon width={22} height={22} />} label={report.grade}>
              {labelFor(product.grade)}
            </Tile>
          )}
          {product.ptaStatus && (
            <Tile visual={<PhoneIcon width={22} height={22} />} label={report.network}>
              {labelFor(product.ptaStatus)}
            </Tile>
          )}
          {product.warrantyMonths !== undefined && (
            <Tile visual={<ShieldIcon width={22} height={22} />} label={report.warranty}>
              {product.warrantyMonths} months
            </Tile>
          )}
        </dl>
      )}

      {product.boxContents.length > 0 && (
        <div>
          <span className="font-body text-[13px] text-ink/60">{report.box}</span>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
            {product.boxContents.map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-[13px] font-medium text-ink/80">
                <CheckIcon width={14} height={14} className="text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
