const META_PATTERNS = {
  name: [/property=["']og:title["'][^>]*content=["']([^"']+)["']/i, /content=["']([^"']+)["'][^>]*property=["']og:title["']/i],
  image: [/property=["']og:image["'][^>]*content=["']([^"']+)["']/i, /content=["']([^"']+)["'][^>]*property=["']og:image["']/i],
  price: [
    /property=["'](?:product|og):price:amount["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*property=["'](?:product|og):price:amount["']/i,
  ],
}

const matchFirst = (html, patterns) => {
  for (const pattern of patterns) {
    const m = pattern.exec(html)
    if (m) return m[1].trim()
  }
  return null
}

const decodeEntities = (text) =>
  text
    ?.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'") ?? null

// JSON-LD의 Product 스키마에서 name/image/price 보강
const parseJsonLd = (html) => {
  const result = {}
  const scripts = html.matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )
  for (const [, raw] of scripts) {
    try {
      const data = JSON.parse(raw)
      const nodes = Array.isArray(data) ? data : [data, ...(data['@graph'] ?? [])]
      for (const node of nodes) {
        if (!/product/i.test(String(node?.['@type']))) continue
        result.name ??= node.name ?? null
        result.image ??= Array.isArray(node.image) ? node.image[0] : (node.image ?? null)
        const offer = Array.isArray(node.offers) ? node.offers[0] : node.offers
        result.price ??= offer?.price ?? offer?.lowPrice ?? null
      }
    } catch {
      // JSON 파싱 실패한 스크립트는 무시
    }
  }
  return result
}

export default function parseProduct(html) {
  const jsonLd = parseJsonLd(html)
  const name = decodeEntities(matchFirst(html, META_PATTERNS.name) ?? jsonLd.name)
  const image = matchFirst(html, META_PATTERNS.image) ?? jsonLd.image
  const rawPrice = matchFirst(html, META_PATTERNS.price) ?? jsonLd.price
  const price = rawPrice ? Number(String(rawPrice).replace(/[^\d.]/g, '')) || null : null
  return { name, image, price }
}
