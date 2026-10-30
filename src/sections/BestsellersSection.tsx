import { Reveal } from '@/components/common/Reveal'
import { ShopProductCard } from '@/components/shop/ShopProductCard'
import { ArrowUpRightIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { BESTSELLERS } from '@/constants/home'
import { ROUTES } from '@/constants/routes'
import { PRODUCT_ROW_GRID_CLASSES } from '@/constants/shop'
import { ButtonSize, ButtonVariant, IconAnimation } from '@/constants/ui'
import { cn } from '@/lib/cn'

export function BestsellersSection() {
  return (
    <section className="mt-10 sm:mt-14 lg:mt-[70px]">
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
            className="max-sm:w-full"
          >
            View all
          </Button>
        }
      />

      <ul className={cn(PRODUCT_ROW_GRID_CLASSES, 'mt-5 sm:mt-6')}>
        {BESTSELLERS.map((product, index) => (
          <li key={product.id} className="mx-auto h-full w-full max-w-[340px] sm:max-w-none">
            <Reveal delay={index * 0.06} className="h-full">
              <ShopProductCard product={product} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
