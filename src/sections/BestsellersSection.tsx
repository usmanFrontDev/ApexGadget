import { ProductCard } from '@/components/common/ProductCard'
import { Reveal } from '@/components/common/Reveal'
import { ArrowUpRightIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { BESTSELLERS } from '@/constants/home'
import { ROUTES } from '@/constants/routes'
import { ButtonSize, ButtonVariant, IconAnimation } from '@/constants/ui'

export function BestsellersSection() {
  return (
    <section className="mt-14 lg:mt-[70px]">
      <SectionHeading
        eyebrow="Handpicked"
        title="Bestsellers this week"
        action={
          <Button
            to={ROUTES.shop}
            variant={ButtonVariant.Secondary}
            size={ButtonSize.Sm}
            icon={<ArrowUpRightIcon />}
            iconAnimation={IconAnimation.PointRight}
          >
            View all
          </Button>
        }
      />

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6 xl:gap-7">
        {BESTSELLERS.map((product, index) => (
          <li key={product.id} className="h-full">
            <Reveal delay={index * 0.06} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
