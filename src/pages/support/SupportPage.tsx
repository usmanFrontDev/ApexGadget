import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Container } from '@/components/ui/Container'
import { Typography } from '@/components/ui/Typography'
import { SupportNav } from '@/components/support/SupportNav'
import { ROUTES } from '@/constants/routes'
import { SUPPORT_CONTENT } from '@/constants/support'
import { TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'
import { useSeo } from '@/hooks/useSeo'
import { SupportContactSection } from '@/sections/SupportContactSection'
import { SupportFaqSection } from '@/sections/SupportFaqSection'
import { SupportPoliciesSection } from '@/sections/SupportPoliciesSection'

export default function SupportPage() {
  useSeo({ title: SUPPORT_CONTENT.breadcrumb, description: SUPPORT_CONTENT.lead, canonical: ROUTES.support })

  return (
    <Container className="pt-4 sm:pt-6">
      <Breadcrumb items={[{ label: 'Home', to: ROUTES.home }, { label: SUPPORT_CONTENT.breadcrumb }]} />
      <div className="mt-4 sm:mt-6">
        <Typography as="h1" variant={TypographyVariant.Display} align={TypographyAlign.CenterBelowLg}>
          {SUPPORT_CONTENT.title}
        </Typography>
        <Typography variant={TypographyVariant.Lead} tone={TypographyTone.Muted} align={TypographyAlign.CenterBelowLg} className="mt-3 max-w-[620px] lg:mx-0">
          {SUPPORT_CONTENT.lead}
        </Typography>
        <div className="mt-5">
          <SupportNav />
        </div>
      </div>

      <SupportContactSection />
      <SupportPoliciesSection />
      <SupportFaqSection />
    </Container>
  )
}
