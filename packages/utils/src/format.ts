export function formatPrice(amount: number | string, currency = '¥'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return `${currency}0.00`
  return `${currency}${num.toFixed(2)}`
}

export function formatDate(date: string | Date, locale = 'zh-CN'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function formatOrderNo(orderNo: string): string {
  return orderNo.toUpperCase()
}
