import { CartLineCard } from '@/components/cart/CartLineCard'
import { useRemoveCartLine, useUpdatingLineIds } from '@/hooks/useCartMutations'
import type { CartLine } from '@/types/cart.types'

export interface CartLineListProps {
  lines: readonly CartLine[]
}

/** The lines as a list; owns the remove / quantity mutations. */
export function CartLineList({ lines }: CartLineListProps) {
  const removeLine = useRemoveCartLine()
  const updating = useUpdatingLineIds()

  return (
    <ul className="flex flex-col gap-3 sm:gap-4">
      {lines.map((line) => (
        <li key={line.id}>
          <CartLineCard
            line={line}
            pending={updating.has(line.id)}
            onRemove={(item) => removeLine.mutate(item.id)}
          />
        </li>
      ))}
    </ul>
  )
}
