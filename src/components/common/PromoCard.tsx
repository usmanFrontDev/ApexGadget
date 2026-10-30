import { ArrowUpRightIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { GlassCard } from '@/components/ui/GlassCard'
import { IconButton } from '@/components/ui/IconButton'
import { Typography } from '@/components/ui/Typography'
import {
  ButtonSize,
  ChipSize,
  ChipVariant,
  GlassCardVariant,
  IconAnimation,
  TypographyAlign,
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'
import { cn } from '@/lib/cn'
import type { PromoCardData } from '@/types/home.types'

export interface PromoCardProps {
  data: PromoCardData
}

export function PromoCard({ data }: PromoCardProps) {
  const { label, titleLines, description, cta, image, imageAlt, imageClassName } = data

  return (
    <GlassCard
      as="article"
      variant={GlassCardVariant.Promo}
      className="flex h-full flex-col px-4 pb-0 pt-6 sm:min-h-[311px] sm:p-8"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-[42%] hidden size-[400px] rounded-full bg-[radial-gradient(closest-side,rgb(200_32_40/0.52),transparent_95%)] sm:block"
      />

      {/* Phone: soft glow behind the picture */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 size-[320px] -translate-x-1/2 translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,rgb(200_32_40/0.16),transparent_95%)] sm:hidden"
      />

      <img
        src={image}
        alt={imageAlt}
        // Eager on purpose: an absolutely-positioned lazy image inside a clipped, blurred card
        // can fail to trigger its load and the card's picture goes missing.
        loading="eager"
        decoding="async"
        className={cn(
          'pointer-events-none relative order-2 mx-auto mt-5 h-auto w-[78%] max-w-[300px] select-none sm:absolute sm:mx-0 sm:mt-0 sm:max-w-none',
          imageClassName,
        )}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_right,#fff_0%,rgb(255_255_255/0.48)_42%,transparent_85%)] sm:block"
      />

      <div className="relative z-10 order-1 flex flex-col items-center text-center sm:max-w-[min(311px,56%)] sm:flex-1 sm:items-start sm:text-left">
        <Chip size={ChipSize.Sm} variant={ChipVariant.Label}>
          {label}
        </Chip>
        <Typography variant={TypographyVariant.Title} className="mt-3 sm:mt-[15px]">
          {titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </Typography>
        <Typography
          variant={TypographyVariant.Body}
          tone={TypographyTone.Muted}
          align={TypographyAlign.CenterBelowSm}
          className="mt-2.5 sm:mt-3"
        >
          {description}
        </Typography>
        <div className="mt-5 w-full sm:mt-auto sm:w-auto sm:pt-[19px]">
          <Button
            to={cta.to}
            size={ButtonSize.Md}
            icon={<ArrowUpRightIcon />}
            iconAnimation={IconAnimation.PointRight}
            blockOnMobile
          >
            {cta.label}
          </Button>
        </div>
      </div>

      <IconButton
        to={cta.to}
        label={cta.label}
        iconAnimation={IconAnimation.PointRight}
        className="absolute right-6 top-6 z-10 max-sm:hidden"
      >
        <ArrowUpRightIcon />
      </IconButton>
    </GlassCard>
  )
}
