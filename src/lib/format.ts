const PKR = 'PKR'
const PKR_LOCALE = 'en-PK'

/** Format a money amount. PKR is shown in whole rupees: formatPrice(359500, 'PKR') -> "Rs 359,500". */
export function formatPrice(amount: number, currencyCode: string) {
  if (currencyCode === PKR) {
    return new Intl.NumberFormat(PKR_LOCALE, {
      style: 'currency',
      currency: PKR,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}
