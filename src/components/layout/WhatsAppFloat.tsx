import { motion, useReducedMotion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { WhatsAppIcon } from '@/components/icons'
import { ROUTES } from '@/constants/routes'
import { SUPPORT_WHATSAPP_MESSAGE, WHATSAPP_FLOAT_LABEL } from '@/constants/support'
import { useWhatsAppNumber } from '@/hooks/useWhatsAppNumber'
import { cn } from '@/lib/cn'
import { buildWhatsAppUrl } from '@/lib/tradeInMessage'

/**
 * Round WhatsApp button, bottom right on every page: opens a chat with the store (number from the site settings,
 * the same one as trade-in and Support). Nothing without a configured number. On the cart page below lg it sits above
 * the sticky checkout bar.
 */
export function WhatsAppFloat() {
  const number = useWhatsAppNumber()
  const reduceMotion = useReducedMotion()
  const onCartPage = useLocation().pathname === ROUTES.cart
  if (!number) return null

  return (
    <motion.a
      href={buildWhatsAppUrl(number, SUPPORT_WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={WHATSAPP_FLOAT_LABEL}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={reduceMotion ? undefined : { scale: 1.08 }}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 380, damping: 24 }}
      className={cn(
        'fixed right-4 z-30 grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_10px_28px_rgb(37_211_102/0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-whatsapp sm:right-6',
        onCartPage ? 'bottom-32 lg:bottom-6' : 'bottom-5 sm:bottom-6',
      )}
    >
      <WhatsAppIcon width={28} height={28} />
    </motion.a>
  )
}
