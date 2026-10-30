import { Container } from '@/components/ui/Container'
import { Typography } from '@/components/ui/Typography'
import { TypographyVariant } from '@/constants/ui'

export default function SupportPage() {
  return (
    <Container className="py-20">
      <Typography variant={TypographyVariant.Display}>Support</Typography>
    </Container>
  )
}
