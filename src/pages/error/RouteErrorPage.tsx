import { AlertIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { ERROR_PAGE_CONTENT } from '@/constants/errors'
import { ROUTES } from '@/constants/routes'
import { ButtonSize, ButtonVariant } from '@/constants/ui'

/** A page crashed while rendering: shown inside the layout (header and footer stay) instead of a blank screen. */
export default function RouteErrorPage() {
  const { crash } = ERROR_PAGE_CONTENT
  return (
    <Container className="pt-6 sm:pt-10">
      <EmptyState
        icon={<AlertIcon width={24} height={24} />}
        title={crash.title}
        description={crash.description}
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size={ButtonSize.Md} onClick={() => window.location.reload()} blockOnMobile>
              {crash.retry}
            </Button>
            <Button to={ROUTES.shop} variant={ButtonVariant.Secondary} size={ButtonSize.Md} blockOnMobile>
              {crash.shop}
            </Button>
          </div>
        }
      />
    </Container>
  )
}
