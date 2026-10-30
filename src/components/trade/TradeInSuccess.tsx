import type { Ref } from 'react'
import { CheckIcon, WhatsAppIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Typography } from '@/components/ui/Typography'
import { PAGE_BANNERS } from '@/constants/images'
import { ROUTES } from '@/constants/routes'
import { TRADE_IN_CONTENT } from '@/constants/trade'
import { ButtonSize, ButtonVariant, TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'

export interface TradeInSuccessProps {
  /** Focus target: the heading. */
  headingRef?: Ref<HTMLElement>
  /** The wa.me link: a real anchor, so it works even when `window.open` was blocked. */
  whatsAppUrl?: string
}

/** Shown after "Send on WhatsApp". The heading takes focus so screen readers announce the result. */
export function TradeInSuccess({ whatsAppUrl, headingRef }: TradeInSuccessProps) {
  const { success } = TRADE_IN_CONTENT
  return (
    <div className="flex flex-col items-center px-1 py-4 text-center sm:py-8">
      <span
        aria-hidden="true"
        className="grid size-14 place-items-center rounded-full bg-emerald-500/12 text-emerald-600 shadow-ring"
      >
        <CheckIcon width={24} height={24} />
      </span>
      <Typography ref={headingRef} tabIndex={-1} as="h2" variant={TypographyVariant.Title} className="mt-5 outline-none">
        {success.title}
      </Typography>
      <Typography
        variant={TypographyVariant.Body}
        tone={TypographyTone.Muted}
        align={TypographyAlign.Center}
        className="mt-3 max-w-[420px]"
      >
        {success.text}
      </Typography>

      <div className="mt-6 flex w-full max-w-[360px] flex-col gap-2.5">
        {whatsAppUrl && (
          <Button
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            size={ButtonSize.Lg}
            icon={<WhatsAppIcon width={17} height={17} />}
            blockOnMobile
          >
            {success.open}
          </Button>
        )}
        <Button to={ROUTES.home} variant={ButtonVariant.Secondary} size={ButtonSize.Lg} className="w-full">
          {success.home}
        </Button>
      </div>

      <img
        src={PAGE_BANNERS.tradeIn.src}
        alt=""
        loading="lazy"
        className="mt-7 aspect-[4/3] w-full max-w-[360px] rounded-[20px] bg-ink-deep object-cover object-[90%_center]"
      />
    </div>
  )
}
