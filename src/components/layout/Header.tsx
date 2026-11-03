import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SwapIcon } from '@/components/icons'
import { Logo } from '@/components/layout/Logo'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { IconButton } from '@/components/ui/IconButton'
import { NAV_ITEMS } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import { BUTTON_ICON_PX, ButtonIconStyle, IconPosition } from '@/constants/ui'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistCount } from '@/store/useWishlistStore'

export interface HeaderProps {
  cartCount?: number
}

/** Round header buttons: 44px touch targets, 40px on the narrowest phones so the bar still fits at 320px. */
const barButtonClasses = 'max-[360px]:size-10'

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  cn('text-sm font-semibold transition-colors hover:text-primary', isActive ? 'text-primary' : 'text-ink')

export function Header({ cartCount = 0 }: HeaderProps) {
  const [menuRequested, setMenuRequested] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  // The full-screen menu only exists below lg: growing the window closes it.
  const menuOpen = menuRequested && !isDesktop
  const wishlistCount = useWishlistCount()
  const openCartDrawer = useCartStore((state) => state.openDrawer)
  const onCartPage = useLocation().pathname === ROUTES.cart
  const closeMenu = () => setMenuRequested(false)

  // Full-screen menu: no page scroll behind it, Esc closes it.
  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuRequested(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 pt-3 sm:pt-4">
      <Container>
        <div className="relative">
          <div className="relative z-10 flex h-16 items-center gap-3 rounded-full bg-white/5 pl-4 pr-2 shadow-header backdrop-blur-[18px] sm:pl-[22px] sm:pr-3 lg:h-[84px] lg:pr-[22px]">
            <Link to={ROUTES.home} aria-label="Apex Gadgets — home" className="shrink-0">
              <Logo className="h-7 sm:h-8" />
            </Link>

            <nav aria-label="Primary" className="ml-[60px] hidden items-center gap-[65px] lg:flex">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} className={navLinkClasses}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2 sm:gap-3.5">
              <Link
                to={ROUTES.trade}
                className="hidden h-[34px] items-center gap-2 rounded-full bg-primary/9 pl-3 pr-3.5 text-xs font-bold tracking-[0.2px] text-primary shadow-ring-primary transition hover:bg-primary/14 lg:inline-flex"
              >
                <SwapIcon width={15} height={15} />
                Get a Trade-in Quote
              </Link>

              <ThemeToggle className={barButtonClasses} />

              <span className="relative inline-flex">
                <IconButton
                  to={ROUTES.wishlist}
                  label={wishlistCount > 0 ? `Favorites, ${wishlistCount} saved` : 'Favorites'}
                  className={barButtonClasses}
                >
                  <HeartIcon />
                </IconButton>
                {wishlistCount > 0 && (
                  <span className="pointer-events-none absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 font-body text-[10px] font-bold text-white">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </span>

              <span className="relative inline-flex">
                {/* Opens the mini-cart; on /cart itself it is a plain link to the current page. */}
                <IconButton
                  label={`Cart, ${cartCount} items`}
                  data-cart-trigger=""
                  className={barButtonClasses}
                  {...(onCartPage ? { to: ROUTES.cart, 'aria-current': 'page' as const } : { onClick: openCartDrawer })}
                >
                  <BagIcon />
                </IconButton>
                {cartCount > 0 && (
                  <span className="pointer-events-none absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 font-body text-[10px] font-bold text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </span>


              <IconButton
                label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuRequested((open) => !open)}
                className={cn('lg:hidden', barButtonClasses)}
              >
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </div>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                id="mobile-menu"
                aria-label="Mobile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-0 overflow-y-auto overscroll-contain bg-canvas/95 px-3 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[92px] backdrop-blur-[24px] sm:px-6 sm:pt-[100px]"
              >
                <ul className="mx-auto flex min-h-full max-w-[520px] flex-col gap-1">
                  {NAV_ITEMS.map((item, index) => (
                    <motion.li
                      key={item.to}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.04 * index }}
                    >
                      <NavLink
                        to={item.to}
                        onClick={closeMenu}
                        className={(state) => cn(navLinkClasses(state), 'block rounded-2xl px-4 py-4 text-2xl font-bold')}
                      >
                        {item.label}
                      </NavLink>
                    </motion.li>
                  ))}
                  <li className="mt-4">
                    <Button
                      to={ROUTES.trade}
                      onClick={closeMenu}
                      icon={<SwapIcon width={BUTTON_ICON_PX} height={BUTTON_ICON_PX} />}
                      iconStyle={ButtonIconStyle.Plain}
                      iconPosition={IconPosition.Start}
                      blockOnMobile
                      className="sm:mx-auto sm:flex sm:w-[320px]"
                    >
                      Get a Trade-in Quote
                    </Button>
                  </li>
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </header>
  )
}
