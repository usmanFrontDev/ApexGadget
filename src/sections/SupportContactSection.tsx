import { ContactForm } from '@/components/support/ContactForm'
import { SupportArt } from '@/components/support/SupportArt'
import { Chip } from '@/components/ui/Chip'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import { SUPPORT_CONTENT, SupportSectionId } from '@/constants/support'
import { ChipSize, GlassCardVariant, TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'

/** One big card: the contact form on the left, the "We're here to help!" illustration on the right (from lg). */
export function SupportContactSection() {
  const { contact } = SUPPORT_CONTENT
  return (
    <section id={SupportSectionId.Contact} aria-labelledby="support-contact-title" className="mt-6 scroll-mt-28 sm:mt-8">
      <GlassCard variant={GlassCardVariant.Soft} className="rounded-[28px]">
        <div className="grid lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <div className="p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col items-center lg:items-start">
              <Chip size={ChipSize.Xs} icon={<span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />}>
                <span className="font-bold uppercase tracking-[1.2px]">{contact.eyebrow}</span>
              </Chip>
              <Typography as="h2" id="support-contact-title" variant={TypographyVariant.Heading} align={TypographyAlign.CenterBelowLg} className="mt-3">
                {contact.title}
              </Typography>
              <Typography variant={TypographyVariant.Body} tone={TypographyTone.Muted} align={TypographyAlign.CenterBelowLg} className="mt-2 max-w-[520px]">
                {contact.lead}
              </Typography>
            </div>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div className="relative hidden flex-col items-center justify-center px-8 py-10 text-center lg:flex">
            {/* Divider that stops short of the card's top and bottom edges (as in the design). */}
            <span aria-hidden="true" className="absolute inset-y-8 left-0 w-px bg-ink/9" />
            <SupportArt />
            <Typography as="p" variant={TypographyVariant.Subtitle} className="-mt-8">
              {contact.sideTitle}
            </Typography>
            <Typography variant={TypographyVariant.Body} tone={TypographyTone.Muted} align={TypographyAlign.Center} className="mt-1.5 max-w-[260px]">
              {contact.sideText}
            </Typography>
          </div>
        </div>
      </GlassCard>
    </section>
  )
}
