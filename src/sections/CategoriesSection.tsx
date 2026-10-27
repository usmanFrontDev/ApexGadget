import { CategoryCard } from '@/components/common/CategoryCard'
import { Reveal } from '@/components/common/Reveal'
import { ArrowUpRightIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CATEGORIES, CATEGORIES_SECTION_ID } from '@/constants/home'
import { ROUTES } from '@/constants/routes'
import { ButtonSize, ButtonVariant, IconAnimation } from '@/constants/ui'

export function CategoriesSection() {
  return (
    <section id={CATEGORIES_SECTION_ID} className="mt-14 scroll-mt-28 lg:mt-[78px]">
      <SectionHeading
        eyebrow="Find your fit"
        title="Shop By Category"
        action={
          <Button
            to={ROUTES.shop}
            variant={ButtonVariant.Secondary}
            size={ButtonSize.Sm}
            icon={<ArrowUpRightIcon />}
            iconAnimation={IconAnimation.PointRight}
          >
            All categories
          </Button>
        }
      />

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-[18px]">
        {CATEGORIES.map((category, index) => (
          <li key={category.id} className="h-full">
            <Reveal delay={index * 0.06} className="h-full">
              <CategoryCard category={category} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
