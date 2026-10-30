import { Container } from '@/components/ui/Container'
import { BannerSection } from '@/sections/BannerSection'
import { BestsellersSection } from '@/sections/BestsellersSection'
import { CategoriesSection } from '@/sections/CategoriesSection'
import { HeroSection } from '@/sections/HeroSection'
import { PromoCardsSection } from '@/sections/PromoCardsSection'
import { TestimonialsSection } from '@/sections/TestimonialsSection'
import { WhyShopSection } from '@/sections/WhyShopSection'

export default function HomePage() {
  return (
    <Container className="pt-3 sm:pt-5">
      <div className="flex flex-col gap-3 sm:gap-[18px]">
        <HeroSection />
        <PromoCardsSection />
      </div>
      <CategoriesSection />
      <BannerSection />
      <BestsellersSection />
      <WhyShopSection />
      <TestimonialsSection />
    </Container>
  )
}
