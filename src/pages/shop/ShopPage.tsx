import { Container } from '@/components/ui/Container'
import { useShopFilters } from '@/hooks/useShopFilters'
import { ShopCatalogSection } from '@/sections/ShopCatalogSection'
import { ShopIntroSection } from '@/sections/ShopIntroSection'

export default function ShopPage() {
  const shop = useShopFilters()

  return (
    <Container className="pt-6">
      <ShopIntroSection filters={shop.filters} onSelectPill={shop.selectModel} />
      <ShopCatalogSection shop={shop} />
    </Container>
  )
}
