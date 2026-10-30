import { ShopBanner } from '@/components/shop/ShopBanner'
import { ShopPills } from '@/components/shop/ShopPills'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Typography } from '@/components/ui/Typography'
import { ROUTES } from '@/constants/routes'
import { SHOP_BANNER, SHOP_PAGE_CONTENT, type ShopCategoryId } from '@/constants/shop'
import { TypographyTone, TypographyVariant } from '@/constants/ui'
import type { ShopQuery } from '@/types/shop.types'

export interface ShopIntroSectionProps {
  query: ShopQuery
  onSelectPill: (category: ShopCategoryId, model?: string) => void
}

export function ShopIntroSection({ query, onSelectPill }: ShopIntroSectionProps) {
  const content = SHOP_PAGE_CONTENT[query.category]
  const title = query.search ? `Results for “${query.search}”` : content.title
  const description = query.search ? 'Matching iPhones and accessories, refine them with the filters.' : content.description

  return (
    <section>
      <Breadcrumb items={[{ label: 'Home', to: ROUTES.home }, { label: 'Shop' }]} />

      <Typography variant={TypographyVariant.Display} className="mt-5 sm:text-[38px] xl:text-[38px] xl:leading-[1.1]">
        {title}
      </Typography>
      <Typography
        variant={TypographyVariant.Lead}
        tone={TypographyTone.Muted}
        className="mt-2.5 max-w-[460px]"
      >
        {description}
      </Typography>

      <div className="mt-6">
        <ShopBanner image={SHOP_BANNER.image} alt={SHOP_BANNER.alt} to={SHOP_BANNER.to} />
      </div>

      <div className="mt-5">
        <ShopPills query={query} onSelect={onSelectPill} />
      </div>
    </section>
  )
}
