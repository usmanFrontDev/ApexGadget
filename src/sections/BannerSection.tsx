import { BannerCarousel } from '@/components/common/BannerCarousel'
import { Reveal } from '@/components/common/Reveal'
import { BANNER_AUTOPLAY_MS, BANNER_SLIDES } from '@/constants/home'

export function BannerSection() {
  return (
    <Reveal className="mt-14 lg:mt-[72px]">
      <BannerCarousel slides={BANNER_SLIDES} autoPlayMs={BANNER_AUTOPLAY_MS} />
    </Reveal>
  )
}
