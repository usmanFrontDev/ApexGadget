import { PageBanner } from '@/components/common/PageBanner'
import { ArrowUpRightIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Typography } from '@/components/ui/Typography'
import { PAGE_BANNERS } from '@/constants/images'
import { ROUTES } from '@/constants/routes'
import { TRADE_IN_CONTENT, TRADE_IN_FIRST_FIELD_ID, TRADE_IN_FORM_ID } from '@/constants/trade'
import { IconAnimation, PageBannerTone, TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'
import { useSeo } from '@/hooks/useSeo'
import { TradeInSection } from '@/sections/TradeInSection'

const HEADING_ID = 'trade-in-step-heading'

/** "Get Started": scroll to the form (instantly for reduced motion) and focus its first field. */
function focusTradeInForm() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(TRADE_IN_FORM_ID)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  const target = document.getElementById(TRADE_IN_FIRST_FIELD_ID) ?? document.getElementById(HEADING_ID)
  target?.focus({ preventScroll: true })
}

export default function TradePage() {
  useSeo({
    title: 'Trade in your iPhone',
    description: TRADE_IN_CONTENT.lead,
    canonical: ROUTES.trade,
  })

  return (
    <Container className="pt-4 sm:pt-6">
      <PageBanner
        eyebrow={TRADE_IN_CONTENT.eyebrow}
        title={TRADE_IN_CONTENT.title}
        lead={TRADE_IN_CONTENT.lead}
        image={PAGE_BANNERS.tradeIn.src}
        imageWidth={PAGE_BANNERS.tradeIn.width}
        imageHeight={PAGE_BANNERS.tradeIn.height}
        tone={PageBannerTone.Dark}
        artPositionClassName="object-[90%_center]"
        mobileContent={
          <ol className="mx-auto mt-6 flex max-w-[360px] flex-col gap-2.5 text-left">
            {TRADE_IN_CONTENT.steps.map((step) => (
              <li key={step.number} className="flex items-center gap-3 rounded-full bg-white/80 py-2 pl-2 pr-5 shadow-ring">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-[13px] font-bold text-primary shadow-ring-primary">
                  {step.number}
                </span>
                <span className="min-w-0">
                  <Typography as="span" variant={TypographyVariant.CardTitle} className="block truncate text-[14px]">
                    {step.title}
                  </Typography>
                  <Typography
                    as="span"
                    variant={TypographyVariant.Caption}
                    tone={TypographyTone.Muted}
                    align={TypographyAlign.Start}
                    className="block truncate"
                  >
                    {step.caption}
                  </Typography>
                </span>
              </li>
            ))}
          </ol>
        }
        mobileAction={
          <Button
            type="button"
            onClick={focusTradeInForm}
            icon={<ArrowUpRightIcon />}
            iconAnimation={IconAnimation.PointRight}
            blockOnMobile
            className="sm:mx-auto"
          >
            {TRADE_IN_CONTENT.getStarted}
          </Button>
        }
      />
      <TradeInSection />
    </Container>
  )
}
