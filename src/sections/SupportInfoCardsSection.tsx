import { CardIcon, ShieldIcon, TruckIcon } from '@/components/icons'
import { SupportInfoCard } from '@/components/support/SupportInfoCard'
import { SUPPORT_CARD_IMAGES, SUPPORT_CONTENT, SupportSectionId, type SupportPanelId } from '@/constants/support'

const CARDS = [
  { id: SupportSectionId.Shipping, icon: <TruckIcon width={20} height={20} /> },
  { id: SupportSectionId.Warranty, icon: <ShieldIcon width={20} height={20} /> },
  { id: SupportSectionId.Payments, icon: <CardIcon width={20} height={20} /> },
] as const

export interface SupportInfoCardsSectionProps {
  onOpen: (panel: SupportPanelId) => void
}

/** Shipping & returns, Warranty and Payments: three cards, each opening its full text in a side panel. */
export function SupportInfoCardsSection({ onOpen }: SupportInfoCardsSectionProps) {
  return (
    <ul className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 md:grid-cols-3">
      {CARDS.map((card) => {
        const copy = SUPPORT_CONTENT.cards[card.id]
        return (
          <li key={card.id}>
            <SupportInfoCard
              id={card.id}
              icon={card.icon}
              title={copy.title}
              text={copy.text}
              linkLabel={copy.link}
              image={SUPPORT_CARD_IMAGES[card.id]}
              onOpen={() => onOpen(card.id)}
            />
          </li>
        )
      })}
    </ul>
  )
}
