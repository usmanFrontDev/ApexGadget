import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { CartDrawerLine } from '@/components/cart/CartDrawerLine'
import { CartEmpty } from '@/components/cart/CartEmpty'
import { CheckoutButton } from '@/components/cart/CheckoutButton'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Drawer } from '@/components/ui/Drawer'
import { Typography } from '@/components/ui/Typography'
import { CART_CONTENT } from '@/constants/cart'
import { ROUTES } from '@/constants/routes'
import { ButtonSize, ButtonVariant, TypographyTone, TypographyVariant } from '@/constants/ui'
import { useCart } from '@/hooks/useCart'
import { useUpdateCartLine, useUpdatingLineIds } from '@/hooks/useCartMutations'
import { getCartTotals } from '@/lib/cartTotals'
import { formatPrice } from '@/lib/format'
import { useCartStore } from '@/store/useCartStore'

/** `data-cart-trigger` on the header's cart button: focus returns there when the drawer closes. */
export const CART_TRIGGER_SELECTOR = '[data-cart-trigger]'

/** Mini-cart: opens from the header cart icon and after Add to Cart; closes on Esc, overlay and route change. */
export function CartDrawer() {
  const open = useCartStore((state) => state.drawerOpen)
  const closeDrawer = useCartStore((state) => state.closeDrawer)
  const { pathname } = useLocation()
  const query = useCart({ fresh: open })
  const updateLine = useUpdateCartLine()
  const updating = useUpdatingLineIds()

  useEffect(() => {
    closeDrawer()
  }, [pathname, closeDrawer])

  const cart = query.data ?? undefined
  const lines = cart?.lines ?? []
  const totals = cart ? getCartTotals(cart) : undefined
  const loading = query.isLoading

  const footer =
    cart && lines.length > 0 ? (
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <Typography variant={TypographyVariant.Body} tone={TypographyTone.Soft} className="font-sans">
            {CART_CONTENT.drawer.subtotal}
          </Typography>
          <Typography variant={TypographyVariant.Price}>
            {formatPrice(totals?.subtotal ?? 0, totals?.currencyCode ?? 'PKR')}
          </Typography>
        </div>
        <CheckoutButton cart={cart} />
        <Button to={ROUTES.cart} variant={ButtonVariant.Secondary} size={ButtonSize.Lg} onClick={closeDrawer} block>
          {CART_CONTENT.summary.viewCart}
        </Button>
      </div>
    ) : undefined

  return (
    <Drawer
      open={open}
      onClose={closeDrawer}
      title={CART_CONTENT.drawer.title.replace('{count}', String(cart?.totalQuantity ?? 0))}
      footer={footer}
      returnFocusSelector={CART_TRIGGER_SELECTOR}
    >
      {loading ? (
        <div aria-hidden="true" className="flex flex-col gap-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : lines.length === 0 ? (
        <CartEmpty compact onAction={closeDrawer} />
      ) : (
        <ul className="flex flex-col gap-5">
          {lines.map((line) => (
            <li key={line.id}>
              <CartDrawerLine
                line={line}
                pending={updating.has(line.id)}
                onQuantityChange={(item, quantity) => updateLine.mutate({ lineId: item.id, quantity })}
                onNavigate={closeDrawer}
              />
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  )
}
