import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRightIcon } from '@/components/icons'
import { CartQuantityControl } from '@/components/cart/CartQuantityControl'
import { ChoiceChips } from '@/components/form/ChoiceChips'
import { ConditionReport } from '@/components/product/ConditionReport'
import { PRODUCT_DETAILS_ID } from '@/constants/product'
import { ROUTES } from '@/constants/routes'
import { WishlistButton } from '@/components/common/WishlistButton'
import { fieldLabelId } from '@/components/form/fieldIds'
import { FormField } from '@/components/form/FormField'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import { LOW_STOCK_MAX, PRODUCT_CONTENT } from '@/constants/product'
import {
  ButtonSize,
  ButtonVariant,
  ChipSize,
  ChipVariant,
  GlassCardVariant,
  IconAnimation,
  TypographyAlign,
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'
import { useCartLineForVariant } from '@/hooks/useCart'
import { useAddToCart } from '@/hooks/useCartMutations'
import { formatPrice } from '@/lib/format'
import { firstParagraphText, truncateText } from '@/lib/html'
import { findVariant, getMetaLine } from '@/lib/productView'
import type { ProductDetail } from '@/types/product.types'

const BLURB_MAX = 200

export interface ProductBuyBoxProps {
  product: ProductDetail
}

/** Title, price, short blurb, option picker, "Add to Cart" (or the sold state) and the trust strip. */
export function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const [selection, setSelection] = useState<Record<string, string>>({})
  const addToCart = useAddToCart()

  const variant = useMemo(() => findVariant(product, selection), [product, selection])
  const needsOptions = product.options.length > 0
  const price = variant?.priceAmount ?? product.priceAmount
  const compareAt = variant?.compareAtAmount ?? product.compareAtAmount
  const saving = compareAt !== undefined && compareAt > price ? compareAt - price : undefined
  const meta = getMetaLine(product)
  const blurb = truncateText(firstParagraphText(product.descriptionHtml), BLURB_MAX)
  const sold = product.sold || (variant ? !variant.availableForSale : false)

  const onAdd = () => {
    if (!variant) return
    addToCart.mutate({ variantId: variant.id, productHandle: product.handle, quantity: 1 })
  }

  // Already in the cart: "Add to Cart" becomes "View cart" (plus a quantity stepper when more than one unit exists).
  const line = useCartLineForVariant(variant?.id)
  const stockLimit = line?.quantityAvailable ?? variant?.quantityAvailable ?? Number.POSITIVE_INFINITY
  const atLimit = line !== undefined && line.quantity >= stockLimit

  const stockChip = sold
    ? { label: PRODUCT_CONTENT.soldChip, variant: ChipVariant.Dark }
    : variant?.quantityAvailable !== undefined && variant.quantityAvailable <= LOW_STOCK_MAX
      ? { label: PRODUCT_CONTENT.lowStock.replace('{n}', String(variant.quantityAvailable)), variant: ChipVariant.Tint }
      : { label: PRODUCT_CONTENT.inStock, variant: ChipVariant.Default }

  return (
    <div className="flex flex-1 flex-col">
      <GlassCard variant={GlassCardVariant.Soft} className="flex flex-1 flex-col rounded-[24px] p-5 sm:p-6">
        <div className="flex justify-center lg:justify-start">
          <Chip size={ChipSize.Sm} variant={stockChip.variant}>
            {stockChip.label}
          </Chip>
        </div>

        <Typography
          variant={TypographyVariant.Heading}
          align={TypographyAlign.CenterBelowLg}
          className="mt-3 text-balance sm:text-[30px] lg:text-[34px]"
        >
          {product.title}
        </Typography>
        {meta && (
          <Typography
            variant={TypographyVariant.Body}
            tone={TypographyTone.Muted}
            align={TypographyAlign.CenterBelowLg}
            className="mt-1.5"
          >
            {meta}
          </Typography>
        )}

        <div className="mt-5 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2 lg:justify-start">
          <Typography variant={TypographyVariant.Price} className="text-[30px] leading-none sm:text-[34px]">
            {formatPrice(price, product.currencyCode)}
          </Typography>
          {saving !== undefined && compareAt !== undefined && (
            <>
              <Typography as="span" variant={TypographyVariant.Body} tone={TypographyTone.Muted} className="line-through">
                <span className="sr-only">Was </span>
                {formatPrice(compareAt, product.currencyCode)}
              </Typography>
              <Chip size={ChipSize.Sm} variant={ChipVariant.Tint} className="self-center">
                {PRODUCT_CONTENT.save} {formatPrice(saving, product.currencyCode)}
              </Chip>
            </>
          )}
        </div>

        {blurb && (
          <Typography
            variant={TypographyVariant.Body}
            tone={TypographyTone.Soft}
            align={TypographyAlign.CenterBelowLg}
            className="mt-3.5"
          >
            {blurb}{' '}
            <a
              href={`#${PRODUCT_DETAILS_ID}`}
              className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {PRODUCT_CONTENT.fullDetails}
            </a>
          </Typography>
        )}

        {/* What the buyer needs to decide comes first; the buttons are last. */}
        <div className="mt-5 border-t border-ink/8 pt-5">
          <ConditionReport product={product} />
        </div>

        {needsOptions && (
          <div className="mt-5 flex flex-col gap-4">
            {product.options.map((option) => {
              const id = `option-${option.name.toLowerCase().replace(/\W+/g, '-')}`
              return (
                <FormField key={option.name} id={id} label={option.name} asGroup>
                  <ChoiceChips
                    options={option.values.map((value) => ({ value, label: value }))}
                    value={selection[option.name]}
                    onChange={(value) => setSelection((previous) => ({ ...previous, [option.name]: value }))}
                    labelledBy={fieldLabelId(id)}
                    className="flex flex-wrap justify-center gap-2 lg:justify-start"
                  />
                </FormField>
              )
            })}
          </div>
        )}

        {/* Pushes the actions to the bottom of the card when the card is stretched to the gallery's height. */}
        <div aria-hidden="true" className="min-h-6 flex-1" />

        {/* Actions come last (the decision). Full width only on phones (Button blockOnMobile); side by side from sm. */}
        <div className="flex flex-col gap-3 border-t border-ink/8 pt-6 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
          {sold ? (
            <Button type="button" variant={ButtonVariant.Secondary} size={ButtonSize.Lg} disabled blockOnMobile>
              {PRODUCT_CONTENT.soldOut}
            </Button>
          ) : line ? (
            // Added: the button turns into the quantity control, like on the product cards (trash at 1).
            <CartQuantityControl line={line} removable className="max-sm:w-full max-sm:justify-between" />
          ) : (
            <Button
              type="button"
              size={ButtonSize.Lg}
              icon={<ArrowUpRightIcon />}
              iconAnimation={IconAnimation.PointRight}
              disabled={!variant || addToCart.isPending}
              onClick={onAdd}
              blockOnMobile
            >
              {PRODUCT_CONTENT.addToCart}
            </Button>
          )}
          <WishlistButton
            handle={product.handle}
            title={product.title}
            label={PRODUCT_CONTENT.favorite}
            buttonSize={ButtonSize.Lg}
            className="max-sm:w-full max-sm:justify-center"
          />
        </div>

        {line && !sold && (
          <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted} align={TypographyAlign.CenterBelowLg} className="mt-3.5">
            {atLimit
              ? stockLimit === 1
                ? PRODUCT_CONTENT.onlyOneHint
                : PRODUCT_CONTENT.stockLimitHint.replace('{n}', String(stockLimit))
              : PRODUCT_CONTENT.inCartHint}{' '}
            <Link
              to={ROUTES.cart}
              className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {PRODUCT_CONTENT.viewCart}
            </Link>
          </Typography>
        )}

        {sold ? (
          <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted} align={TypographyAlign.CenterBelowLg} className="mt-3.5">
            {PRODUCT_CONTENT.soldHint}
          </Typography>
        ) : (
          needsOptions &&
          !variant && (
            <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted} align={TypographyAlign.CenterBelowLg} className="mt-3.5">
              {PRODUCT_CONTENT.selectOptions}
            </Typography>
          )
        )}
      </GlassCard>
    </div>
  )
}
