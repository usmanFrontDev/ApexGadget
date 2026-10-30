import toast from 'react-hot-toast'
import { CartToast } from '@/components/cart/CartToast'
import { CART_CONTENT } from '@/constants/cart'

/** The design's "Item removed" toast (title, "{title} has been removed from your cart.", check badge, close X). */
export function showItemRemovedToast(productTitle: string) {
  toast.custom((item) => (
    <CartToast
      title={CART_CONTENT.toast.removedTitle}
      text={CART_CONTENT.toast.removedText.replace('{title}', productTitle)}
      visible={item.visible}
      onClose={() => toast.dismiss(item.id)}
    />
  ))
}
