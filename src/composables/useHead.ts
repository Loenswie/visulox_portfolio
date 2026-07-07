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

/** Lightweight, dependency-free SEO composable — updates title + OG/meta tags per route. */
export function useHead(meta: () => HeadMeta) {
  watchEffect(() => {
    const { title, description, image } = meta()
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`
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
  })
}
