import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PageBanner } from '@/components/common/PageBanner'
import { SupportInfoDrawer } from '@/components/support/SupportInfoDrawer'
import { Container } from '@/components/ui/Container'
import { PAGE_BANNERS } from '@/constants/images'
import { ROUTES } from '@/constants/routes'
import {
  SUPPORT_CONTENT,
  SUPPORT_PANEL_IDS,
  SupportSectionId,
  type SupportPanelId,
} from '@/constants/support'
import { useSeo } from '@/hooks/useSeo'
import { SupportContactSection } from '@/sections/SupportContactSection'
import { SupportFaqSection } from '@/sections/SupportFaqSection'
import { SupportInfoCardsSection } from '@/sections/SupportInfoCardsSection'
import { SupportQuickHelpSection } from '@/sections/SupportQuickHelpSection'

const isPanelId = (value: string): value is SupportPanelId => (SUPPORT_PANEL_IDS as readonly string[]).includes(value)

const scrollToSection = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })

export default function SupportPage() {
  const { banner } = SUPPORT_CONTENT
  useSeo({ title: SUPPORT_CONTENT.breadcrumb, description: banner.lead, canonical: ROUTES.support })

  const [panel, setPanel] = useState<SupportPanelId | null>(null)
  const { hash } = useLocation()
  const [syncedHash, setSyncedHash] = useState('')

  // `/support#warranty` (footer links) opens that card's text; a new hash is adopted while rendering.
  if (hash !== syncedHash) {
    setSyncedHash(hash)
    const id = decodeURIComponent(hash.slice(1))
    if (isPanelId(id)) setPanel(id)
  }

  return (
    <Container className="pt-4 sm:pt-6">
      <PageBanner
        title={banner.title}
        lead={banner.lead}
        image={PAGE_BANNERS.support.src}
        imageWidth={PAGE_BANNERS.support.width}
        imageHeight={PAGE_BANNERS.support.height}
        breadcrumb={[{ label: 'Home', to: ROUTES.home }, { label: SUPPORT_CONTENT.breadcrumb }]}
      />

      <SupportQuickHelpSection onEmail={() => scrollToSection(SupportSectionId.Contact)} />
      <SupportContactSection />
      <SupportInfoCardsSection onOpen={setPanel} />
      <SupportFaqSection />

      <SupportInfoDrawer panel={panel} onClose={() => setPanel(null)} />
    </Container>
  )
}
