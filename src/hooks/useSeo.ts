import { useEffect } from 'react'

export interface SeoInput {
  title: string
  description?: string
  /** Absolute or root-relative canonical URL. */
  canonical?: string
  image?: string
  /** `schema.org` JSON-LD object (e.g. a Product). */
  jsonLd?: Record<string, unknown>
  /** Private pages (cart): `robots: noindex, nofollow`. */
  noindex?: boolean
}

const SITE_NAME = 'Apex Gadgets'
const JSON_LD_ID = 'apex-json-ld'

function setMeta(attribute: 'name' | 'property', key: string, content: string | undefined) {
  const selector = `meta[${attribute}="${key}"]`
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!content) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

function setCanonical(href: string | undefined) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!href) {
    link?.remove()
    return
  }
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = new URL(href, window.location.origin).toString()
}

/** Per-page `<title>`, description, canonical, Open Graph and JSON-LD (docs/shopify/09). Client-side only, see the SEO notes. */
export function useSeo({ title, description, canonical, image, jsonLd, noindex }: SeoInput) {
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : undefined

  useEffect(() => {
    const previousTitle = document.title
    document.title = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:image', image)
    setCanonical(canonical)
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : undefined)

    let script: HTMLScriptElement | null = null
    if (jsonLdText) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = JSON_LD_ID
      script.textContent = jsonLdText
      document.head.appendChild(script)
    }

    return () => {
      document.title = previousTitle
      script?.remove()
    }
  }, [title, description, canonical, image, jsonLdText, noindex])
}
