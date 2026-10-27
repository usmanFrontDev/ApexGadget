import { FeatureCard } from '@/components/common/FeatureCard'
import { Reveal } from '@/components/common/Reveal'
import { ShieldIcon } from '@/components/icons'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { WHY_SHOP_ITEMS } from '@/constants/home'

export function WhyShopSection() {
  return (
    <section className="mt-14 lg:mt-[88px]">
      <SectionHeading eyebrow="The fine print, made simple" title="Why shop with us" />

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[18px]">
        {WHY_SHOP_ITEMS.map((item, index) => (
          <li key={item.id} className="h-full">
            <Reveal delay={index * 0.06} className="h-full">
              <FeatureCard icon={<ShieldIcon />} title={item.title} description={item.description} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
