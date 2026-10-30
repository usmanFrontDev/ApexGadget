import { WhatsAppIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import { PRODUCT_CONTENT } from '@/constants/product'
import {
  ButtonSize,
  ButtonVariant,
  GlassCardVariant,
  IconPosition,
  TypographyAlign,
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'
import { useWhatsAppNumber } from '@/hooks/useWhatsAppNumber'
import { buildProductInquiryUrl } from '@/lib/productInquiry'

export interface AskOnWhatsAppProps {
  title: string
  storage?: string
  /** Canonical URL of the product page (sent in the message). */
  pageUrl: string
}

/** "Questions about this phone?" card with a pre-filled WhatsApp message. Hidden without a configured number. */
export function AskOnWhatsApp({ title, storage, pageUrl }: AskOnWhatsAppProps) {
  const number = useWhatsAppNumber()
  const url = number ? buildProductInquiryUrl(number, { title, storage }, pageUrl) : undefined
  if (!url) return null
  const { ask } = PRODUCT_CONTENT

  return (
    <GlassCard variant={GlassCardVariant.Soft} className="rounded-[20px] p-4 sm:p-5">
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
        <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-500/12 text-emerald-600 shadow-ring">
          <WhatsAppIcon width={20} height={20} />
        </span>
        <div className="min-w-0 flex-1">
          <Typography variant={TypographyVariant.CardTitle} align={TypographyAlign.CenterBelowSm}>
            {ask.title}
          </Typography>
          <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted} align={TypographyAlign.CenterBelowSm} className="mt-0.5">
            {ask.text}
          </Typography>
        </div>
        <Button
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          variant={ButtonVariant.Secondary}
          size={ButtonSize.Sm}
          icon={<WhatsAppIcon width={15} height={15} />}
          iconPosition={IconPosition.Start}
          className="max-sm:w-full"
        >
          {ask.button}
        </Button>
      </div>
    </GlassCard>
  )
}
