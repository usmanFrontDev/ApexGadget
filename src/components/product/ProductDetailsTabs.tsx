import { Skeleton } from '@/components/ui/Skeleton'
import { GlassCard } from '@/components/ui/GlassCard'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { Typography } from '@/components/ui/Typography'
import { PRODUCT_CONTENT, PRODUCT_TABS, ProductTabId } from '@/constants/product'
import { GlassCardVariant, TypographyTone, TypographyVariant } from '@/constants/ui'
import { useShopPolicies } from '@/hooks/useShopPolicies'
import { getDetailRows } from '@/lib/productView'
import { sanitizeHtml } from '@/lib/sanitizeHtml'
import type { ProductDetail } from '@/types/product.types'

export interface ProductDetailsTabsProps {
  product: ProductDetail
}

function RichText({ html, empty }: { html: string | undefined; empty: string }) {
  const clean = html ? sanitizeHtml(html).trim() : ''
  if (!clean) {
    return (
      <Typography variant={TypographyVariant.Body} tone={TypographyTone.Muted}>
        {empty}
      </Typography>
    )
  }
  return <div className="rich-text" dangerouslySetInnerHTML={{ __html: clean }} />
}

function DetailsCard({ product }: ProductDetailsTabsProps) {
  const rows = getDetailRows(product)
  if (rows.length === 0 && product.boxContents.length === 0) return null
  return (
    <GlassCard variant={GlassCardVariant.Soft} className="rounded-[20px] p-5">
      <Typography variant={TypographyVariant.CardTitle}>{PRODUCT_CONTENT.detailsTitle}</Typography>
      {rows.length > 0 && (
        <dl className="mt-3 divide-y divide-ink/8">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4 py-2.5 text-[13px]">
              <dt className="shrink-0 font-body text-ink/60">{row.label}</dt>
              <dd className="min-w-0 truncate text-right font-semibold">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {product.boxContents.length > 0 && (
        <>
          <Typography variant={TypographyVariant.BodySm} className="mt-4 font-sans font-bold">
            {PRODUCT_CONTENT.whatsInTheBox}
          </Typography>
          <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="mt-1">
            {product.boxContents.join(', ')}
          </Typography>
        </>
      )}
      {product.warrantyNote && (
        <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="mt-3">
          {product.warrantyNote}
        </Typography>
      )}
    </GlassCard>
  )
}

function ShippingPanel() {
  const policies = useShopPolicies()
  if (policies.isPending) {
    return (
      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    )
  }
  const html = [policies.data?.shippingHtml, policies.data?.refundHtml].filter(Boolean).join('\n')
  return <RichText html={html} empty={PRODUCT_CONTENT.noPolicy} />
}

/** Description | Specifications | Shipping & Returns. */
export function ProductDetailsTabs({ product }: ProductDetailsTabsProps) {
  const panels: Record<ProductTabId, TabItem['panel']> = {
    [ProductTabId.Description]: (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
        <RichText html={product.descriptionHtml} empty={PRODUCT_CONTENT.noDescription} />
        <DetailsCard product={product} />
      </div>
    ),
    [ProductTabId.Specifications]:
      product.specs.length === 0 ? (
        <Typography variant={TypographyVariant.Body} tone={TypographyTone.Muted}>
          {PRODUCT_CONTENT.noSpecs}
        </Typography>
      ) : (
        <dl className="max-w-[640px] divide-y divide-ink/8 rounded-[20px] bg-white/60 px-5 shadow-ring">
          {product.specs.map((spec) => (
            <div key={spec.label} className="flex items-baseline justify-between gap-4 py-3 text-[13.5px]">
              <dt className="shrink-0 font-body text-ink/60">{spec.label}</dt>
              <dd className="min-w-0 text-right font-semibold">{spec.value}</dd>
            </div>
          ))}
        </dl>
      ),
    [ProductTabId.Shipping]: <ShippingPanel />,
  }

  return (
    <GlassCard variant={GlassCardVariant.Soft} className="rounded-[24px] px-4 pb-6 pt-2 sm:px-7">
      <Tabs label="Product information" items={PRODUCT_TABS.map((tab) => ({ ...tab, panel: panels[tab.id] }))} />
    </GlassCard>
  )
}
