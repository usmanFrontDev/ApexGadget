import DOMPurify from 'dompurify'

/** Shopify descriptions / policies are HTML written by the client: always sanitise before `dangerouslySetInnerHTML`. */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true }, FORBID_TAGS: ['style'], FORBID_ATTR: ['style'] })
}
