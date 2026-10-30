import { useParams } from 'react-router-dom'
import { CtaBanner } from '@/components/common/CtaBanner'
import { SearchIcon } from '@/components/icons'
import { AskOnWhatsApp } from '@/components/product/AskOnWhatsApp'
import { ProductBuyBox } from '@/components/product/ProductBuyBox'
import { ProductDetailsTabs } from '@/components/product/ProductDetailsTabs'
import { ProductGallery } from '@/components/product/ProductGallery'
import { TrustStrip } from '@/components/product/TrustStrip'
import { HIGHLIGHTS_MIN, ProductHighlights } from '@/components/product/ProductHighlights'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { GlassCard } from '@/components/ui/GlassCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { PRODUCT_CONTENT, PRODUCT_DETAILS_ID } from '@/constants/product'
import { productPath, ROUTES } from '@/constants/routes'
import { ButtonSize, GlassCardVariant } from '@/constants/ui'
import { useProduct } from '@/hooks/useProduct'
import { useSeo } from '@/hooks/useSeo'
import { labelFor } from '@/lib/filterLabels'
import { firstParagraphText, truncateText } from '@/lib/html'
import { buildProductJsonLd } from '@/lib/productJsonLd'
import { SimilarProductsSection } from '@/sections/SimilarProductsSection'
import type { ProductDetail } from '@/types/product.types'

const META_DESCRIPTION_MAX = 155

function ProductPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading product" className="mt-4 grid gap-5 lg:grid-cols-2 lg:gap-6">
      <Skeleton className="aspect-square rounded-[24px] lg:aspect-[8/7]" />
      <GlassCard variant={GlassCardVariant.Soft} className="rounded-[24px] p-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="mt-3 h-4 w-1/2" />
        <Skeleton className="mt-6 h-9 w-1/3" />
        <Skeleton className="mt-5 h-16 w-full" />
        <Skeleton className="mt-6 h-[52px] rounded-full" />
      </GlassCard>
    </div>
  )
}

/** Title: "iPhone 15 Pro — 256GB Natural Titanium | Apex Gadgets" (docs/shopify/09). */
function getSeoTitle(product: ProductDetail) {
  const variantBits = [product.storage?.toUpperCase(), labelFor(product.color)].filter(Boolean).join(' ')
  return product.seo.title ?? (variantBits ? `${product.title} — ${variantBits}` : product.title)
}

function ProductView({ product }: { product: ProductDetail }) {
  const path = productPath(product.handle)
  const description = product.seo.description ?? truncateText(firstParagraphText(product.descriptionHtml), META_DESCRIPTION_MAX)
  const url = new URL(path, window.location.origin).toString()

  useSeo({
    title: getSeoTitle(product),
    description,
    canonical: path,
    image: product.images[0]?.url,
    jsonLd: buildProductJsonLd(product, url),
  })

  const badge = product.sold ? 'Sold' : product.grade ? labelFor(product.grade) : undefined

  return (
    <>
      <Breadcrumb
        items={[{ label: 'Home', to: ROUTES.home }, { label: 'Shop', to: ROUTES.shop }, { label: product.title }]}
      />

      <div className="mt-4 grid gap-5 sm:mt-5 lg:grid-cols-2 lg:items-stretch lg:gap-6">
        {/* Both columns are as tall as the taller one: the gallery picture grows, the buy box pushes its buttons down. */}
        <div className="min-w-0">
          <ProductGallery
            images={product.images}
            title={product.title}
            badge={badge}
            sold={product.sold}
            below={product.specs.length >= HIGHLIGHTS_MIN ? <ProductHighlights specs={product.specs} /> : undefined}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-3.5">
          <ProductBuyBox key={product.handle} product={product} />
          <AskOnWhatsApp title={product.title} storage={product.storage} pageUrl={url} />
          <TrustStrip />
        </div>
      </div>

      <div id={PRODUCT_DETAILS_ID} className="mt-8 scroll-mt-28 sm:mt-10">
        <ProductDetailsTabs product={product} />
      </div>

      <SimilarProductsSection handle={product.handle} model={product.model} />

      <CtaBanner
        title={PRODUCT_CONTENT.cta.title}
        description={PRODUCT_CONTENT.cta.description}
        to={ROUTES.trade}
        className="mt-10 sm:mt-12"
      />
    </>
  )
}

export default function ProductPage() {
  const { handle } = useParams()
  const query = useProduct(handle)

  let content
  if (query.isPending) {
    content = <ProductPageSkeleton />
  } else if (query.isError) {
    content = (
      <EmptyState
        icon={<SearchIcon width={24} height={24} />}
        title={PRODUCT_CONTENT.error.title}
        description={PRODUCT_CONTENT.error.description}
        action={
          <Button size={ButtonSize.Md} onClick={() => query.refetch()}>
            Try again
          </Button>
        }
      />
    )
  } else if (!query.data) {
    content = (
      <EmptyState
        icon={<SearchIcon width={24} height={24} />}
        title={PRODUCT_CONTENT.notFound.title}
        description={PRODUCT_CONTENT.notFound.description}
        action={
          <Button to={ROUTES.shop} size={ButtonSize.Md}>
            {PRODUCT_CONTENT.notFound.action}
          </Button>
        }
      />
    )
  } else {
    content = <ProductView product={query.data} />
  }

  return <Container className="pt-4 sm:pt-6">{content}</Container>
}
