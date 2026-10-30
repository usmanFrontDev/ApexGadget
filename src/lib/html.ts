/** Plain text of an HTML snippet (for meta descriptions / short blurbs). Output is text, never inserted as HTML. */
export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6]|br)>|<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/** Text of the first paragraph (the description's lead sentence); falls back to the whole text. */
export function firstParagraphText(html: string): string {
  const match = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(html)
  return htmlToText(match?.[1] ?? html)
}

/** First `max` characters, cut at a word boundary, with an ellipsis when shortened. */
export function truncateText(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}
