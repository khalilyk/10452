import { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from '../data/content.ts'

const Ctx = createContext<SiteContent>(DEFAULT_CONTENT)

/**
 * Fetches /api/content once and provides the merged result to the whole
 * storefront. Renders with the static defaults immediately rather than
 * blocking on the network — a first paint that matches what was always
 * hardcoded, then updates in place if an edit exists, beats a blank screen
 * while we find out.
 */
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((body) => setContent(mergeContent(body?.content)))
      .catch(() => {}) // Defaults already rendered; nothing to change.
  }, [])

  return <Ctx.Provider value={content}>{children}</Ctx.Provider>
}

export function useContent(): SiteContent {
  return useContext(Ctx)
}
