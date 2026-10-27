import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink } from 'react-router-dom'
import logo from '@/assets/images/logo.png'
import { BagIcon, CloseIcon, HeartIcon, MenuIcon } from '@/components/icons'
import { Container } from '@/components/ui/Container'
import { IconButton } from '@/components/ui/IconButton'
import { NAV_ITEMS } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'

export interface HeaderProps {
  cartCount?: number
  userInitials?: string
}

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  cn('text-sm font-semibold transition-colors hover:text-primary', isActive ? 'text-primary' : 'text-ink')

export function Header({ cartCount = 0, userInitials = '' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 pt-3 sm:pt-4">
      <Container>
        <div className="relative">
          <div className="flex h-16 items-center gap-3 rounded-full bg-white/5 pl-[22px] pr-3 shadow-header backdrop-blur-[18px] lg:h-[84px] lg:pr-[22px]">
            <Link to={ROUTES.home} aria-label="Apex Gadgets — home" className="shrink-0">
              <img src={logo} alt="Apex Gadgets" width={80} height={32} className="h-8 w-auto" />
            </Link>

            <nav aria-label="Primary" className="ml-[60px] hidden items-center gap-[65px] lg:flex">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} className={navLinkClasses}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2.5 sm:gap-3.5">
              <Link
                to={ROUTES.trade}
                className="hidden h-[34px] items-center gap-2 rounded-full bg-primary/9 pl-3.5 pr-2.5 text-xs font-bold tracking-[0.2px] text-primary shadow-ring-primary md:inline-flex"
              >
                <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                Quote Trade In
              </Link>

              <IconButton label="Wishlist">
                <HeartIcon />
              </IconButton>

              <span className="relative inline-flex">
                <IconButton label={`Cart, ${cartCount} items`}>
                  <BagIcon />
                </IconButton>
                {cartCount > 0 && (
                  <span className="pointer-events-none absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 font-body text-[10px] font-bold text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </span>

              <button
                type="button"
                aria-label="Account"
                className="inline-flex h-12 items-center gap-3 rounded-full bg-white/92 pl-1.5 pr-2 text-sm font-semibold text-ink shadow-ring transition hover:bg-white sm:pl-[19px]"
              >
                <span className="hidden sm:inline">Account</span>
                <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-white">
                  {userInitials}
                </span>
              </button>

              <IconButton
                label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen((open) => !open)}
                className="lg:hidden"
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
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-x-0 top-full mt-2 flex flex-col gap-1 rounded-[28px] bg-white/90 p-3 shadow-glass-hero backdrop-blur-[18px] lg:hidden"
              >
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={closeMenu}
                    className={(state) => cn(navLinkClasses(state), 'rounded-2xl px-4 py-3 text-base')}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <Link
                  to={ROUTES.trade}
                  onClick={closeMenu}
                  className="mt-1 rounded-2xl bg-primary/9 px-4 py-3 text-sm font-bold text-primary"
                >
                  Quote Trade In
                </Link>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </header>
  )
}
