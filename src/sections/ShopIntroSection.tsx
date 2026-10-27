import { ShopBanner } from '@/components/shop/ShopBanner'
import { ShopPills } from '@/components/shop/ShopPills'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ROUTES } from '@/constants/routes'
import { SHOP_BANNER, SHOP_PAGE_CONTENT, type ShopCategoryId } from '@/constants/shop'
import type { ShopFilters } from '@/types/shop.types'

export interface ShopIntroSectionProps {
  filters: ShopFilters
  onSelectPill: (category: ShopCategoryId, model?: string) => void
}

export function ShopIntroSection({ filters, onSelectPill }: ShopIntroSectionProps) {
  const { title, description } = SHOP_PAGE_CONTENT[filters.category]

  return (
    <section>
      <Breadcrumb items={[{ label: 'Home', to: ROUTES.home }, { label: 'Shop' }]} />

      <h1 className="mt-5 text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-[38px]">
        {title}
      </h1>
      <p className="mt-2.5 max-w-[460px] font-body text-[15px] leading-6 text-ink/60">{description}</p>

      <div className="mt-6">
        <ShopBanner image={SHOP_BANNER.image} alt={SHOP_BANNER.alt} to={SHOP_BANNER.to} />
      </div>

      <div className="mt-5">
        <ShopPills filters={filters} onSelect={onSelectPill} />
      </div>
    </section>
  )
}
