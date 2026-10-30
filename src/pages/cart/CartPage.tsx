import { useRef } from 'react'
import { CartEmpty } from '@/components/cart/CartEmpty'
import { CartLineList } from '@/components/cart/CartLineList'
import { CartSkeleton } from '@/components/cart/CartSkeleton'
import { DeliveryNote } from '@/components/cart/DeliveryNote'
import { OrderSummary } from '@/components/cart/OrderSummary'
import { StickyCheckoutBar } from '@/components/cart/StickyCheckoutBar'
import { CtaBanner } from '@/components/common/CtaBanner'
import { SearchIcon } from '@/components/icons'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { Typography } from '@/components/ui/Typography'
import { CART_CONTENT } from '@/constants/cart'
import { PRODUCT_CONTENT } from '@/constants/product'
import { ROUTES } from '@/constants/routes'
import { ButtonSize, TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'
import { useCart } from '@/hooks/useCart'
import { useDemoCartSeed } from '@/hooks/useDemoCart'
import { useInView } from '@/hooks/useInView'
import { useSeo } from '@/hooks/useSeo'
import { formatItemCount } from '@/lib/cartView'
import { CartRecommendationsSection } from '@/sections/CartRecommendationsSection'
import type { Cart } from '@/types/cart.types'

function CartContent({ cart }: { cart: Cart }) {
  const summaryRef = useRef<HTMLDivElement>(null)
  const summaryInView = useInView(summaryRef)

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-[65fr_35fr] lg:items-start lg:gap-6">
        <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
          <CartLineList lines={cart.lines} />
          <DeliveryNote savedNote={cart.note ?? ''} />
        </div>
        {/* Sticky below the header (top-28) and never taller than the viewport. */}
        <div ref={summaryRef} className="min-w-0 lg:sticky lg:top-28">
          <OrderSummary cart={cart} />
        </div>
      </div>

      <CartRecommendationsSection cart={cart} />

      <CtaBanner
        title={PRODUCT_CONTENT.cta.title}
        description={PRODUCT_CONTENT.cta.description}
        to={ROUTES.trade}
        className="mt-10 sm:mt-12"
      />

      <StickyCheckoutBar cart={cart} visible={!summaryInView} />
    </>
  )
}

export default function CartPage() {
  useSeo({ title: CART_CONTENT.title, noindex: true })
  useDemoCartSeed()
  const query = useCart({ fresh: true })
  const cart = query.data ?? undefined
  const hasLines = Boolean(cart && cart.lines.length > 0)

  let content
  if (query.isLoading) {
    content = <CartSkeleton />
  } else if (query.isError) {
    content = (
      <EmptyState
        icon={<SearchIcon width={24} height={24} />}
        title={CART_CONTENT.error.title}
        description={CART_CONTENT.error.text}
        action={
          <Button size={ButtonSize.Md} onClick={() => query.refetch()}>
            {CART_CONTENT.error.retry}
          </Button>
        }
      />
    )
  } else if (cart && hasLines) {
    content = <CartContent cart={cart} />
  } else {
    content = <CartEmpty />
  }

  return (
    // Bottom padding below lg keeps the last content clear of the sticky checkout bar.
    <Container className="pb-24 pt-4 sm:pt-6 lg:pb-0">
      <Breadcrumb items={[{ label: 'Home', to: ROUTES.home }, { label: CART_CONTENT.breadcrumb }]} />
      <div className="mb-5 mt-4 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 sm:mt-5 lg:justify-start">
        <Typography as="h1" variant={TypographyVariant.Heading} align={TypographyAlign.CenterBelowLg}>
          {CART_CONTENT.title}
        </Typography>
        {cart && hasLines && (
          <Typography as="span" variant={TypographyVariant.Body} tone={TypographyTone.Muted}>
            {formatItemCount(cart.totalQuantity)}
          </Typography>
        )}
      </div>
      {content}
    </Container>
  )
}
