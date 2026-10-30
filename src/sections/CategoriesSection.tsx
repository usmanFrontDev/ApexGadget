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
    <section id={CATEGORIES_SECTION_ID} className="mt-10 scroll-mt-28 sm:mt-14 lg:mt-[78px]">
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
            className="max-sm:w-full"
          >
            All categories
          </Button>
        }
      />

      <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5 lg:gap-[18px]">
        {CATEGORIES.map((category, index) => (
          <li key={category.id} className="h-full max-sm:odd:last:col-span-2">
            <Reveal delay={index * 0.06} className="h-full">
              <CategoryCard category={category} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
