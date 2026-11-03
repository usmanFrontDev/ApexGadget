import { ContactForm } from '@/components/support/ContactForm'
import { WhatsAppSupportCard } from '@/components/support/WhatsAppSupportCard'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import { SUPPORT_CONTENT, SupportSectionId } from '@/constants/support'
import { GlassCardVariant, TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'

/** WhatsApp card + the contact form (EmailJS). */
export function SupportContactSection() {
  const { contact } = SUPPORT_CONTENT
  return (
    <section id={SupportSectionId.Contact} aria-labelledby="support-contact-title" className="mt-10 scroll-mt-28 sm:mt-14">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:items-start lg:gap-6">
        <div className="flex flex-col gap-4">
          <div>
            <Typography as="h2" id="support-contact-title" variant={TypographyVariant.Heading} align={TypographyAlign.CenterBelowLg}>
              {contact.title}
            </Typography>
            <Typography variant={TypographyVariant.Body} tone={TypographyTone.Muted} align={TypographyAlign.CenterBelowLg} className="mt-2">
              {contact.lead}
            </Typography>
          </div>
          <WhatsAppSupportCard />
        </div>
        <GlassCard variant={GlassCardVariant.Soft} className="rounded-[24px] p-5 sm:p-6">
          <ContactForm />
        </GlassCard>
      </div>
    </section>
  )
}
