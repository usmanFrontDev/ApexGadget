import { CheckIcon, CloseIcon } from '@/components/icons'
import { Typography } from '@/components/ui/Typography'
import { CART_CONTENT } from '@/constants/cart'
import { TypographyTone, TypographyVariant } from '@/constants/ui'
import { cn } from '@/lib/cn'

export interface CartToastProps {
  title: string
  text: string
  visible: boolean
  onClose: () => void
}

/** "Item removed" toast of the cart design: check badge, title, text and a close button. */
export function CartToast({ title, text, visible, onClose }: CartToastProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex w-[min(92vw,360px)] items-start gap-3 rounded-[20px] bg-white p-4 shadow-glass-hero transition duration-200 motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
      )}
    >
      <span aria-hidden="true" className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
        <CheckIcon width={14} height={14} />
      </span>
      <div className="min-w-0 flex-1">
        <Typography as="p" variant={TypographyVariant.BodySm} className="font-sans font-bold">
          {title}
        </Typography>
        <Typography as="p" variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="mt-0.5 line-clamp-3">
          {text}
        </Typography>
      </div>
      <button
        type="button"
        aria-label={CART_CONTENT.toast.close}
        onClick={onClose}
        className="-m-2 grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink/60 transition hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
      >
        <CloseIcon width={14} height={14} />
      </button>
    </div>
  )
}
