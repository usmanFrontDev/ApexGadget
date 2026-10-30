import { motion } from 'framer-motion'
import { ArrowUpRightIcon, CheckIcon, ClockIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { GlassCard } from '@/components/ui/GlassCard'
import { IconButton } from '@/components/ui/IconButton'
import { Typography } from '@/components/ui/Typography'
import { HERO_CONTENT, HERO_IMAGE, SOCIAL_LINKS } from '@/constants/home'
import {
  ButtonSize,
  ButtonVariant,
  ChipSize,
  GlassCardVariant,
  IconAnimation,
  IconButtonSize,
  TypographyAlign,
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'

export function HeroSection() {
  const { badge, titleLines, description, highlights, primaryCta, secondaryCta, followLabel } =
    HERO_CONTENT

  return (
    <GlassCard
      as="section"
      variant={GlassCardVariant.Hero}
      className="px-4 pb-4 pt-6 sm:px-8 sm:pb-6 sm:pt-10 lg:min-h-[627px] lg:px-8 lg:py-10"
    >
      <div className="relative z-10 flex flex-col items-center lg:max-w-[510px] lg:items-start">
        <Chip size={ChipSize.Md} icon={<ClockIcon className="text-primary" />}>
          {badge}
        </Chip>

        <Typography
          variant={TypographyVariant.Display}
          align={TypographyAlign.CenterBelowLg}
          className="mt-4 sm:mt-5"
        >
          {titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </Typography>

        <Typography
          variant={TypographyVariant.Lead}
          tone={TypographyTone.Muted}
          align={TypographyAlign.CenterBelowLg}
          className="mt-3 max-w-[480px] sm:mt-4"
        >
          {description}
        </Typography>

        <ul className="mt-6 flex w-full flex-col gap-2 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-2.5 lg:justify-start">
          {highlights.map((item) => (
            <li key={item} className="max-sm:w-full">
              <Chip
                size={ChipSize.Lg}
                icon={<CheckIcon className="text-primary" />}
                className="max-sm:w-full max-sm:justify-center"
              >
                {item}
              </Chip>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex w-full flex-col gap-2.5 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3 lg:mt-[38px] lg:justify-start">
          <Button
            {...primaryCta}
            icon={<ArrowUpRightIcon />}
            iconAnimation={IconAnimation.PointRight}
            blockOnMobile
          >
            {primaryCta.label}
          </Button>
          <Button
            {...secondaryCta}
            variant={ButtonVariant.Secondary}
            size={ButtonSize.Lg}
            className="max-sm:w-full"
          >
            {secondaryCta.label}
          </Button>
        </div>

        <div className="mt-11 hidden flex-wrap items-center gap-x-[13px] gap-y-3 lg:flex">
          <Typography
            as="span"
            variant={TypographyVariant.Eyebrow}
            tone={TypographyTone.Muted}
            className="whitespace-nowrap font-sans"
          >
            {followLabel}
          </Typography>
          <ul className="flex gap-2">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.label}>
                <IconButton
                  href={social.href}
                  label={social.label}
                  size={IconButtonSize.Sm}
                  className="text-[11.5px] font-bold"
                >
                  {social.shortLabel}
                </IconButton>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right column (desktop): everything after the text, image centered in it */}
      <div className="relative mt-5 flex justify-center sm:mt-6 lg:absolute lg:inset-y-0 lg:left-[480px] lg:right-0 lg:mt-0 lg:items-end xl:left-[550px]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 size-[360px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(200_32_40/0.17),transparent_95%)] lg:-top-[90px] lg:size-[520px]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[367px] hidden size-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(200_32_40/0.17),transparent_95%)] lg:block"
        />
        <motion.img
          src={HERO_IMAGE}
          alt="Used iPhone Pro in orange titanium"
          width={436}
          height={507}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative h-auto w-[88%] max-w-[420px] sm:w-[70%] sm:max-w-[500px] lg:mb-px lg:w-[min(436px,90%)] lg:max-w-none"
        />
      </div>
    </GlassCard>
  )
}
