import { WhatsAppIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import { SUPPORT_CONTENT, SUPPORT_WHATSAPP_MESSAGE } from '@/constants/support'
import { ButtonSize, ButtonVariant, GlassCardVariant, IconPosition, TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'
import { useWhatsAppNumber } from '@/hooks/useWhatsAppNumber'
import { buildWhatsAppUrl } from '@/lib/tradeInMessage'

/** "Fastest: WhatsApp" card (same number as the trade-in). Hidden without a configured number. */
export function WhatsAppSupportCard() {
  const number = useWhatsAppNumber()
  const url = number ? buildWhatsAppUrl(number, SUPPORT_WHATSAPP_MESSAGE) : undefined
  if (!url) return null
  const { whatsapp } = SUPPORT_CONTENT

  return (
    <GlassCard variant={GlassCardVariant.Soft} className="rounded-[24px] p-5 sm:p-6">
      <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
        <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-emerald-500/12 text-emerald-600 shadow-ring">
          <WhatsAppIcon width={22} height={22} />
        </span>
        <div>
          <Typography variant={TypographyVariant.Subtitle} align={TypographyAlign.CenterBelowLg}>
            {whatsapp.title}
          </Typography>
          <Typography variant={TypographyVariant.Body} tone={TypographyTone.Muted} align={TypographyAlign.CenterBelowLg} className="mt-1.5">
            {whatsapp.text}
          </Typography>
        </div>
        <Button
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          variant={ButtonVariant.Secondary}
          size={ButtonSize.Md}
          icon={<WhatsAppIcon width={16} height={16} />}
          iconPosition={IconPosition.Start}
          blockOnMobile
        >
          {whatsapp.button}
        </Button>
      </div>
    </GlassCard>
  )
}
