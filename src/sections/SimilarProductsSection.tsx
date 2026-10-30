import { ArrowUpRightIcon, SearchIcon } from '@/components/icons'
import { ShopProductGrid, ShopProductGridSkeleton } from '@/components/shop/ShopProductGrid'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PRODUCT_CONTENT } from '@/constants/product'
import { PRODUCT_ROW_GRID_CLASSES, PRODUCT_ROW_SIZE } from '@/constants/shop'
import { ROUTES } from '@/constants/routes'
import { ButtonSize, ButtonVariant, IconAnimation } from '@/constants/ui'
import { useSimilarProducts } from '@/hooks/useSimilarProducts'

export interface SimilarProductsSectionProps {
  handle: string
  model?: string
}

/** Similar products (4-column grid like the shop). Hidden when there is nothing to show. */
export function SimilarProductsSection({ handle, model }: SimilarProductsSectionProps) {
  const similar = useSimilarProducts(handle, model)
  const { similar: copy } = PRODUCT_CONTENT

  if (similar.isSuccess && similar.data.length === 0) return null

  return (
    <section className="mt-10 sm:mt-14" aria-label={copy.title}>
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        action={
          <Button
            to={ROUTES.shop}
            variant={ButtonVariant.Secondary}
            size={ButtonSize.Sm}
            icon={<ArrowUpRightIcon />}
            iconAnimation={IconAnimation.PointRight}
            className="max-sm:w-full"
          >
            {copy.action}
          </Button>
        }
      />
      <div className="mt-5 sm:mt-6">
        {similar.isPending ? (
          <ShopProductGridSkeleton count={PRODUCT_ROW_SIZE} gridClassName={PRODUCT_ROW_GRID_CLASSES} />
        ) : similar.isError ? (
          <EmptyState
            icon={<SearchIcon width={24} height={24} />}
            title="We couldn't load similar products"
            description="Please try again."
            action={
              <Button size={ButtonSize.Md} onClick={() => similar.refetch()}>
                Try again
              </Button>
            }
          />
        ) : (
          <ShopProductGrid products={similar.data} gridClassName={PRODUCT_ROW_GRID_CLASSES} />
        )}
      </div>
    </section>
  )
}
