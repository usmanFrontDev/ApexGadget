import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CheckIcon, CloseIcon } from '@/components/icons'
import { TextInput } from '@/components/form/TextInput'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Notice } from '@/components/ui/Notice'
import { Typography } from '@/components/ui/Typography'
import { CART_CONTENT } from '@/constants/cart'
import { ButtonSize, ChipSize, ChipVariant, NoticeVariant, TypographyTone, TypographyVariant } from '@/constants/ui'
import { discountCodeSchema, type DiscountCodeValues } from '@/lib/schemas/discount.schema'

export interface DiscountCodeFieldProps {
  /** Code currently applied to the cart. */
  appliedCode?: string
  /** The shop rejected the last code. */
  rejected: boolean
  pending: boolean
  disabled?: boolean
  onApply: (code: string) => void
  onRemove: () => void
}

/** Code input + Apply, the applied chip ("✓ Applied", remove X) and the red "Code not valid" notice. */
export function DiscountCodeField({ appliedCode, rejected, pending, disabled = false, onApply, onRemove }: DiscountCodeFieldProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DiscountCodeValues>({ resolver: zodResolver(discountCodeSchema), defaultValues: { code: '' } })
  const formatError = errors.code?.message
  const invalid = rejected || Boolean(formatError)
  const errorId = 'discount-code-error'

  return (
    <div>
      <form
        noValidate
        onSubmit={handleSubmit(({ code }) => {
          onApply(code)
          reset()
        })}
        className="flex items-start gap-2"
      >
        <div className="min-w-0 flex-1">
          <label htmlFor="discount-code" className="sr-only">
            {CART_CONTENT.discount.label}
          </label>
          <TextInput
            id="discount-code"
            placeholder={CART_CONTENT.discount.placeholder}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            invalid={invalid}
            disabled={disabled}
            aria-describedby={formatError ? errorId : undefined}
            className="h-[46px] uppercase placeholder:normal-case"
            {...register('code')}
          />
        </div>
        <Button type="submit" size={ButtonSize.Sm} disabled={disabled || pending} className="shrink-0">
          {CART_CONTENT.discount.apply}
        </Button>
      </form>

      {formatError && (
        <Typography id={errorId} role="alert" variant={TypographyVariant.Caption} className="mt-1.5 px-1 font-semibold text-primary">
          {formatError}
        </Typography>
      )}

      {/* Persistent live region: the notice is announced when it appears. */}
      <div aria-live="polite">
        {rejected && (
          <Notice
            variant={NoticeVariant.Error}
            title={CART_CONTENT.discount.invalidTitle}
            description={CART_CONTENT.discount.invalidText}
            compact
            className="mt-2.5"
          />
        )}
      </div>

      {appliedCode && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <Chip size={ChipSize.Sm} variant={ChipVariant.Tint} className="min-w-0 pr-1.5">
            {appliedCode}
            <button
              type="button"
              aria-label={CART_CONTENT.discount.remove.replace('{code}', appliedCode)}
              onClick={onRemove}
              className="-mr-1 grid size-8 shrink-0 cursor-pointer place-items-center rounded-full transition hover:bg-primary/12 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <CloseIcon width={11} height={11} />
            </button>
          </Chip>
          <Typography as="span" variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="inline-flex shrink-0 items-center gap-1">
            <CheckIcon width={12} height={12} className="text-emerald-600" />
            {CART_CONTENT.discount.applied}
          </Typography>
        </div>
      )}
    </div>
  )
}
