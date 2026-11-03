import { SearchIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { ERROR_PAGE_CONTENT } from '@/constants/errors'
import { ROUTES } from '@/constants/routes'
import { ButtonSize, ButtonVariant } from '@/constants/ui'
import { useSeo } from '@/hooks/useSeo'

/** Any URL that matches no route. */
export default function NotFoundPage() {
  const { notFound } = ERROR_PAGE_CONTENT
  useSeo({ title: notFound.title, noindex: true })

  return (
    <Container className="pt-6 sm:pt-10">
      <EmptyState
        icon={<SearchIcon width={24} height={24} />}
        title={notFound.title}
        description={notFound.description}
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button to={ROUTES.home} size={ButtonSize.Md} blockOnMobile>
              {notFound.home}
            </Button>
            <Button to={ROUTES.shop} variant={ButtonVariant.Secondary} size={ButtonSize.Md} blockOnMobile>
              {notFound.shop}
            </Button>
          </div>
        }
      />
    </Container>
  )
}
