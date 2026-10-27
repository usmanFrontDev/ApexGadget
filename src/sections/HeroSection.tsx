import { motion } from 'framer-motion'
import { ArrowUpRightIcon, CheckIcon, ClockIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { GlassCard } from '@/components/ui/GlassCard'
import { IconButton } from '@/components/ui/IconButton'
import { HERO_CONTENT, HERO_IMAGE, SOCIAL_LINKS } from '@/constants/home'
import {
  ButtonSize,
  ButtonVariant,
  ChipSize,
  GlassCardVariant,
  IconAnimation,
  IconButtonSize,
} from '@/constants/ui'

export function HeroSection() {
  const { badge, titleLines, description, highlights, primaryCta, secondaryCta, followLabel } =
    HERO_CONTENT

  return (
    <GlassCard
      as="section"
      variant={GlassCardVariant.Hero}
      className="px-5 py-8 sm:px-8 sm:py-10 lg:min-h-[627px]"
    >
      <div className="relative z-10 flex flex-col items-start lg:max-w-[510px]">
        <Chip size={ChipSize.Md} icon={<ClockIcon className="text-primary" />}>
          {badge}
        </Chip>

        <h1 className="mt-5 text-[30px] font-extrabold leading-[1.08] tracking-[-0.031em] sm:text-[44px] xl:text-[52px] xl:leading-[56px]">
          {titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-4 max-w-[480px] font-body text-[15px] leading-[23px] text-ink/62">
          {description}
        </p>

        <ul className="mt-8 flex flex-wrap gap-2.5">
          {highlights.map((item) => (
            <li key={item}>
              <Chip size={ChipSize.Lg} icon={<CheckIcon className="text-primary" />}>
                {item}
              </Chip>
            </li>
          ))}
        </ul>

        <div className="mt-[38px] flex flex-wrap gap-3">
          <Button
            {...primaryCta}
            icon={<ArrowUpRightIcon />}
            iconAnimation={IconAnimation.PointRight}
          >
            {primaryCta.label}
          </Button>
          <Button {...secondaryCta} variant={ButtonVariant.Secondary} size={ButtonSize.Lg}>
            {secondaryCta.label}
          </Button>
        </div>

        <div className="mt-11 flex flex-wrap items-center gap-x-[13px] gap-y-3">
          <span className="whitespace-nowrap text-[11.5px] font-bold uppercase tracking-[1.61px] text-ink/62">
            {followLabel}
          </span>
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
      <div className="relative mt-8 flex justify-center lg:absolute lg:inset-y-0 lg:left-[480px] lg:right-0 lg:mt-0 lg:items-end xl:left-[550px]">
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
          className="relative h-auto w-3/4 max-w-[320px] lg:mb-px lg:w-[min(436px,90%)] lg:max-w-none"
        />
      </div>
    </GlassCard>
  )
}
