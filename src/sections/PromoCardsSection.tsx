import { PromoCard } from '@/components/common/PromoCard'
import { Reveal } from '@/components/common/Reveal'
import { PROMO_CARDS } from '@/constants/home'

export function PromoCardsSection() {
  return (
    <div className="grid gap-[18px] lg:grid-cols-2">
      {PROMO_CARDS.map((card, index) => (
        <Reveal key={card.id} delay={index * 0.1} className="h-full">
          <PromoCard data={card} />
        </Reveal>
      ))}
    </div>
  )
}
