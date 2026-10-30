import { useWatch } from 'react-hook-form'
import { CameraIcon, CheckIcon, ShieldIcon } from '@/components/icons'
import { DeviceSummary } from '@/components/trade/DeviceSummary'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import { TRADE_IN_CONTENT } from '@/constants/trade'
import { GlassCardVariant, TypographyTone, TypographyVariant } from '@/constants/ui'
import type { TradeInValues } from '@/lib/schemas/tradeIn.schema'

/** Desktop sidebar: live device summary, photo tips and the reply promise. */
export function TradeInSidebar() {
  const values = useWatch<TradeInValues>() as Partial<TradeInValues>
  const { summary, photoTips, reply } = TRADE_IN_CONTENT

  return (
    <aside aria-label="Trade-in help" className="flex flex-col gap-3.5 lg:sticky lg:top-28">
      <GlassCard variant={GlassCardVariant.Soft} className="rounded-[20px] p-5">
        <Typography variant={TypographyVariant.CardTitle}>{summary.title}</Typography>
        <DeviceSummary values={values} className="mt-3.5" />
        {!values.model && (
          <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="mt-3">
            {summary.hint}
          </Typography>
        )}
      </GlassCard>

      {/* Photo tips and the reply promise only on desktop: phones get the note on the last step instead. */}
      <GlassCard variant={GlassCardVariant.Promo} className="hidden rounded-[20px] p-5 lg:block">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary shadow-ring-primary">
            <CameraIcon width={19} height={19} />
          </span>
          <Typography variant={TypographyVariant.CardTitle}>{photoTips.title}</Typography>
        </div>
        <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="mt-3">
          {photoTips.intro}
        </Typography>
        <ul className="mt-2 flex flex-col gap-1.5">
          {photoTips.items.map((item) => (
            <li key={item} className="flex items-start gap-2 font-body text-[12.5px] leading-[17px] text-ink/70">
              <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard variant={GlassCardVariant.Soft} className="hidden rounded-[20px] p-5 lg:block">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink shadow-ring">
            <ShieldIcon width={19} height={19} />
          </span>
          <Typography variant={TypographyVariant.CardTitle}>{reply.title}</Typography>
        </div>
        <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="mt-3">
          {reply.text}
        </Typography>
      </GlassCard>
    </aside>
  )
}
