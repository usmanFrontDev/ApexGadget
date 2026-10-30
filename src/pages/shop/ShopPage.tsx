import { Container } from '@/components/ui/Container'
import { useShopFilters } from '@/hooks/useShopFilters'
import { ShopCatalogSection } from '@/sections/ShopCatalogSection'
import { ShopIntroSection } from '@/sections/ShopIntroSection'

export default function ShopPage() {
  const shop = useShopFilters()

  return (
    <Container className="pt-6">
      <ShopIntroSection query={shop.query} onSelectPill={shop.selectPill} />
      <ShopCatalogSection shop={shop} />
    </Container>
  )
}
