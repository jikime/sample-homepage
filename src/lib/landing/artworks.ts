import type { Artwork, LandingContent } from "./types"

export function getArtwork(content: Pick<LandingContent, "artworks">, id: string): Artwork {
  const artwork = content.artworks[id]
  if (!artwork) throw new Error(`Unknown artwork id: ${id}`)
  return artwork
}
