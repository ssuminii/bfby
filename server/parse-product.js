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

const removeTrailingCommas = (json) => {
  let normalized = ''
  let inString = false
  let escaped = false

  for (let i = 0; i < json.length; i += 1) {
    const char = json[i]

    if (inString) {
      normalized += char
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === '"') inString = false
      continue
    }

    if (char === '"') {
      inString = true
      normalized += char
      continue
    }

    if (char === ',') {
      let next = i + 1
      while (/\s/.test(json[next] ?? '')) next += 1
      if (json[next] === '}' || json[next] === ']') continue
    }

    normalized += char
  }

  return normalized
}

const namedValue = (value) => {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return namedValue(value[0])
  return value?.name ?? null
}

const addTag = (tags, value) => {
  const tag = String(value ?? '').trim()
  if (tag && !tags.includes(tag) && tags.length < 3) tags.push(tag)
}

const availabilityTag = (availability) => {
  const value = String(availability ?? '').split('/').pop()?.toLowerCase()
  if (value === 'instock') return '재고 있음'
  if (value === 'outofstock') return '품절'
  if (value === 'preorder') return '예약 판매'
  return null
}

const hasFreeShipping = (shippingDetails) => {
  const details = Array.isArray(shippingDetails) ? shippingDetails : [shippingDetails]
  return details.some((detail) => {
    const rate = detail?.shippingRate
    const value = typeof rate === 'object' ? rate?.value : rate
    return value !== null && value !== undefined && Number(value) === 0
  })
}

// JSON-LD의 Product 스키마에서 name/image/price/tags 보강
const parseJsonLd = (html) => {
  const result = { tags: [] }
  const scripts = html.matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )
  for (const [, raw] of scripts) {
    try {
      const data = JSON.parse(removeTrailingCommas(raw))
      const nodes = Array.isArray(data) ? data : [data, ...(data['@graph'] ?? [])]
      for (const node of nodes) {
        if (!/product/i.test(String(node?.['@type']))) continue
        result.name ??= node.name ?? null
        result.image ??= Array.isArray(node.image) ? node.image[0] : (node.image ?? null)
        addTag(result.tags, namedValue(node.brand))

        const offers = Array.isArray(node.offers) ? node.offers : [node.offers]
        for (const offer of offers) {
          if (!offer) continue
          result.price ??= offer.salePrice ?? offer.price ?? offer.lowPrice ?? null
          addTag(result.tags, availabilityTag(offer.availability))
          if (hasFreeShipping(offer.shippingDetails)) addTag(result.tags, '무료배송')
        }
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
  return { name, image, price, tags: jsonLd.tags }
}
