import { Outlet } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { MOCK_CART_COUNT, MOCK_USER_INITIALS } from '@/constants/mock'
import { NewsletterSection } from '@/sections/NewsletterSection'

/** App shell: page canvas, decorative glows, header and the routed page. */
export function RootLayout() {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-canvas">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className="absolute -left-48 -top-80 size-[1100px] rounded-full bg-[radial-gradient(closest-side,rgb(200_32_40/0.12),transparent_95%)]" />
        <span className="absolute -right-[268px] top-[340px] size-[900px] rounded-full bg-[radial-gradient(closest-side,rgb(20_20_22/0.05),transparent_95%)]" />
        <span className="absolute left-[20%] top-[2100px] size-[1000px] rounded-full bg-[radial-gradient(closest-side,rgb(200_32_40/0.08),transparent_95%)]" />
      </div>

      <ScrollToTop />
      <Header cartCount={MOCK_CART_COUNT} userInitials={MOCK_USER_INITIALS} />
      <main>
        <Outlet />
      </main>
      <NewsletterSection />
      <Footer />
    </div>
  )
}
