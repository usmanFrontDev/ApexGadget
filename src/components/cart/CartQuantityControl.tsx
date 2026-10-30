import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { CART_CONTENT } from '@/constants/cart'
import { QuantityStepperSize } from '@/constants/ui'
import { useRemoveCartLine, useUpdateCartLine, useUpdatingLineIds } from '@/hooks/useCartMutations'
import { getLineMaxQuantity } from '@/lib/cartView'
import type { CartLine } from '@/types/cart.types'

export interface CartQuantityControlProps {
  line: CartLine
  size?: QuantityStepperSize
  /** "−" turns into a trash button at quantity 1 (product cards, product page, mini-cart). The cart page has its own Remove button. */
  removable?: boolean
  className?: string
}

/**
 * THE quantity control of a cart line, used everywhere an item in the cart is shown (product card, product page, cart
 * page, mini-cart). All of them read the same cart cache, so a change in one shows up in the others at once.
 */
export function CartQuantityControl({ line, size = QuantityStepperSize.Md, removable = false, className }: CartQuantityControlProps) {
  const updateLine = useUpdateCartLine()
  const removeLine = useRemoveCartLine()
  const updating = useUpdatingLineIds().has(line.id)

  return (
    <QuantityStepper
      size={size}
      value={line.quantity}
      max={getLineMaxQuantity(line)}
      label={`${CART_CONTENT.line.quantityOf} ${line.productTitle}`}
      disabled={updating}
      onChange={(quantity) => updateLine.mutate({ lineId: line.id, quantity })}
      onRemove={removable ? () => removeLine.mutate(line.id) : undefined}
      removeLabel={CART_CONTENT.line.removeLabel.replace('{title}', line.productTitle)}
      className={className}
    />
  )
}
