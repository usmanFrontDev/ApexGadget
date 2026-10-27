import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

export interface ShopBannerProps {
  /** The finished banner artwork (text and design are part of the image). */
  image: string
  alt: string
  /** Where a click on the banner goes. */
  to: string
  className?: string
}

/** Image-only promo banner: shown in full at its natural ratio, the whole thing is a link. */
export function ShopBanner({ image, alt, to, className }: ShopBannerProps) {
  return (
    <Link
      to={to}
      className={cn(
        'group block overflow-hidden rounded-[16px] shadow-[0_18px_40px_rgb(20_20_22/0.18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary',
        className,
      )}
    >
      <img
        src={image}
        alt={alt}
        className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </Link>
  )
}
