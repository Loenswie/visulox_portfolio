import { watchEffect } from 'vue'

export interface HeadMeta {
  title: string
  description?: string
  image?: string
}

const SITE_NAME = 'VISULOX'

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Lightweight, dependency-free SEO composable — updates title + OG/meta tags per route. */
export function useHead(meta: () => HeadMeta) {
  watchEffect(() => {
    const { title, description, image } = meta()
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} - ${SITE_NAME}`
    document.title = fullTitle

    if (description) {
      setMeta('description', description)
      setMeta('og:description', description, 'property')
      setMeta('twitter:description', description)
    }
    setMeta('og:title', fullTitle, 'property')
    setMeta('twitter:title', fullTitle)

    if (image) {
      setMeta('og:image', image, 'property')
      setMeta('twitter:image', image)
    }

    // Every route gets its own canonical URL — avoids duplicate-content dilution across pages.
    setCanonical(`https://visulox.onrender.com${window.location.pathname}`)
    setMeta('og:url', `https://visulox.onrender.com${window.location.pathname}`, 'property')
  })
}
