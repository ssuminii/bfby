const META_PATTERNS = {
  name: [/property=["']og:title["'][^>]*content=["']([^"']+)["']/i, /content=["']([^"']+)["'][^>]*property=["']og:title["']/i],
  image: [/property=["']og:image["'][^>]*content=["']([^"']+)["']/i, /content=["']([^"']+)["'][^>]*property=["']og:image["']/i],
  description: [
    /(?:name|property)=["']description["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*(?:name|property)=["']description["']/i,
    /(?:name|property)=["']og:description["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*(?:name|property)=["']og:description["']/i,
  ],
  keywords: [
    /(?:name|property)=["']keywords["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*(?:name|property)=["']keywords["']/i,
  ],
  title: [/<title[^>]*>([\s\S]*?)<\/title>/i],
  price: [
    /property=["'](?:product|og):price:amount["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*property=["'](?:product|og):price:amount["']/i,
  ],
}

const HANGUL = /[가-힣]/
const MODEL_CODE = /^[A-Za-z0-9][A-Za-z0-9/_ .-]*$/
const PRODUCT_RISK_TAGS = ['품절 임박', '반품 불가', '교환 불가', '배송비 별도', '해외 배송']

const TAG_RULES = [
  {
    tag: '품절 임박',
    patterns: [
      /품절\s*임박/i,
      /재고\s*(?:가\s*)?(?:얼마\s*)?남지\s*않/i,
      /재고\s*(?:[1-9]|[1-9]\d)\s*(?:개|점|ea)?\s*(?:남음|남았습니다|남았어요|뿐|한정)/i,
    ],
  },
  {
    tag: '반품 불가',
    patterns: [
      /반품\s*(?:불가|불가능|안\s*(?:돼|됩니다|됨)|어려)/i,
      /교환\s*\/\s*반품\s*(?:불가|불가능|안\s*(?:돼|됩니다|됨))/i,
    ],
  },
  {
    tag: '교환 불가',
    patterns: [
      /교환\s*(?:불가|불가능|안\s*(?:돼|됩니다|됨)|어려)/i,
      /교환\s*\/\s*반품\s*(?:불가|불가능|안\s*(?:돼|됩니다|됨))/i,
    ],
  },
  {
    tag: '배송비 별도',
    patterns: [/배송비\s*(?:별도|유료|착불)/i, /배송\s*비\s*별도/i, /유료\s*배송/i],
  },
  {
    tag: '해외 배송',
    patterns: [
      /해외\s*(?:배송|직구|구매대행)/i,
      /국제\s*배송/i,
      /배송\s*출발지\s*[:：]?\s*(?:해외|중국|미국|일본)/i,
    ],
  },
]

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

const cleanKoreanName = (value) => {
  let name = decodeEntities(value)?.trim()
  if (!name || !HANGUL.test(name)) return null

  name = name
    .replace(/\s*정품\s+안심\s+거래\s*\|\s*KREAM\s*$/i, '')
    .replace(/\s*\|\s*KREAM\s*$/i, '')
    .trim()

  if (name.includes(',')) {
    name = name.split(',').find((part) => HANGUL.test(part))?.trim() ?? name
  }

  name = name.replace(/\s*\(([^)]*)\)\s*$/g, (match, content) =>
    HANGUL.test(content) || !MODEL_CODE.test(content) ? match : '',
  ).trim()

  return name && HANGUL.test(name) ? name : null
}

const koreanNameFromKeywords = (keywords) => {
  const parts = decodeEntities(keywords)
    ?.split(',')
    .map((part) => part.trim())
    .filter(Boolean) ?? []

  return parts.find((part) => HANGUL.test(part) && !MODEL_CODE.test(part)) ?? null
}

const preferredKoreanName = (html) =>
  koreanNameFromKeywords(matchFirst(html, META_PATTERNS.keywords))
  ?? cleanKoreanName(matchFirst(html, META_PATTERNS.description))
  ?? cleanKoreanName(matchFirst(html, META_PATTERNS.title))

const hasHost = (html, host) => new RegExp(`https?:\\/\\/[^"']*${host.replace('.', '\\.')}`, 'i').test(html)

const isKreamPage = (html) => {
  const kreamText = [
    matchFirst(html, META_PATTERNS.title),
    matchFirst(html, META_PATTERNS.description),
    matchFirst(html, META_PATTERNS.keywords),
  ].map((text) => decodeEntities(text) ?? '').join(' ')

  return hasHost(html, 'kream.co.kr')
    || /\|\s*KREAM/i.test(kreamText)
    || /정품\s*(?:검수|안심)|실시간\s*시세/u.test(kreamText)
}

const cleanPageTitle = (value) => {
  let name = decodeEntities(value)?.trim()
  if (!name) return null

  name = name
    .replace(/\s+/g, ' ')
    .replace(/\s+\|\s*(?:KREAM|MUSINSA|ZIGZAG|무신사|지그재그).*$/i, '')
    .replace(/\s+-\s*(?:사이즈\s*&\s*후기|후기|리뷰).*$/i, '')
    .trim()

  return name || null
}

const musinsaNameFromDescription = (description) => {
  const text = decodeEntities(description)
  if (!text) return null

  const match = /(?:^|\s)제품\s*[:：]\s*(.+)$/u.exec(text)
  return match?.[1]
    ?.replace(/\s*-\s*[\d,]+(?:\s*원)?\s*$/u, '')
    .trim() || null
}

const knownSiteName = (html) =>
  hasHost(html, 'musinsa.com')
    ? musinsaNameFromDescription(matchFirst(html, META_PATTERNS.description))
    : null

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
  if (PRODUCT_RISK_TAGS.includes(tag) && !tags.includes(tag)) tags.push(tag)
}

const availabilityTag = (availability) => {
  const value = String(availability ?? '').split('/').pop()?.toLowerCase()
  if (value === 'limitedavailability' || value === 'lowstock') return '품절 임박'
  return null
}

const shippingRateValue = (shippingRate) => {
  const value = typeof shippingRate === 'object' ? shippingRate?.value ?? shippingRate?.price : shippingRate
  if (value === null || value === undefined) return null
  const number = Number(String(value).replace(/[^\d.]/g, ''))
  return Number.isFinite(number) ? number : null
}

const hasPaidShipping = (shippingDetails) => {
  const details = Array.isArray(shippingDetails) ? shippingDetails : [shippingDetails]
  return details.some((detail) => (shippingRateValue(detail?.shippingRate) ?? 0) > 0)
}

const isKoreanCountry = (value) => {
  const country = String(namedValue(value) ?? '').trim().toLowerCase()
  return ['kr', 'kor', 'korea', 'south korea', 'republic of korea', '대한민국', '한국'].includes(country)
}

const hasOverseasOrigin = (shippingDetails) => {
  const details = Array.isArray(shippingDetails) ? shippingDetails : [shippingDetails]
  return details.some((detail) => {
    const country = detail?.shippingOrigin?.addressCountry
    return Boolean(country) && !isKoreanCountry(country)
  })
}

const plainText = (html) =>
  decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  ) ?? ''

const riskTagsFromText = (html) => {
  const text = [
    matchFirst(html, META_PATTERNS.description),
    matchFirst(html, META_PATTERNS.keywords),
    matchFirst(html, META_PATTERNS.title),
    plainText(html),
  ]
    .filter(Boolean)
    .join(' ')

  return TAG_RULES.filter(({ patterns }) => patterns.some((pattern) => pattern.test(text))).map(
    ({ tag }) => tag,
  )
}

const findNextGoods = (value) => {
  if (!value || typeof value !== 'object') return null

  const hasProductSignal =
    value.price !== undefined
    || value.original_price !== undefined
    || value.first_page_rendering?.price !== undefined
    || value.linked_option?.price !== undefined
    || value.sku_code
    || value.delivery_type
    || value.standard_category

  if (
    typeof value.name === 'string'
    && hasProductSignal
  ) {
    return value
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const goods = findNextGoods(item)
      if (goods) return goods
    }
    return null
  }

  for (const item of Object.values(value)) {
    const goods = findNextGoods(item)
    if (goods) return goods
  }

  return null
}

const parseNextData = (html) => {
  const match = /<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i.exec(html)
  if (!match) return {}

  try {
    let data
    try {
      data = JSON.parse(match[1])
    } catch {
      data = JSON.parse(decodeEntities(match[1]) ?? match[1])
    }
    const goods = findNextGoods(data)
    if (!goods) return {}

    return {
      name: goods.name ?? goods.first_page_rendering?.goods_name ?? null,
      image:
        goods.cover_image
        ?? goods.first_page_rendering?.cover_image
        ?? goods.image
        ?? goods.image_webp
        ?? null,
      price:
        goods.price
        ?? goods.first_page_rendering?.price
        ?? goods.linked_option?.price
        ?? null,
      tags: [
        goods.is_limited ? '품절 임박' : null,
        goods.delivery_fee ? '배송비 별도' : null,
        goods.is_overseas_delivery ? '해외 배송' : null,
      ].filter(Boolean),
    }
  } catch {
    return {}
  }
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

        const offers = Array.isArray(node.offers) ? node.offers : [node.offers]
        for (const offer of offers) {
          if (!offer) continue
          result.price ??= offer.salePrice ?? offer.price ?? offer.lowPrice ?? null
          addTag(result.tags, availabilityTag(offer.availability))
          if (hasPaidShipping(offer.shippingDetails)) addTag(result.tags, '배송비 별도')
          if (hasOverseasOrigin(offer.shippingDetails)) addTag(result.tags, '해외 배송')
        }
      }
    } catch {
      // JSON 파싱 실패한 스크립트는 무시
    }
  }
  return result
}

export default function parseProduct(html) {
  const nextData = parseNextData(html)
  const jsonLd = parseJsonLd(html)
  const name =
    decodeEntities(nextData.name)?.trim()
    ?? (isKreamPage(html) ? preferredKoreanName(html) : null)
    ?? knownSiteName(html)
    ?? cleanPageTitle(matchFirst(html, META_PATTERNS.name) ?? jsonLd.name)
  const image = matchFirst(html, META_PATTERNS.image) ?? nextData.image ?? jsonLd.image
  const rawPrice = matchFirst(html, META_PATTERNS.price) ?? nextData.price ?? jsonLd.price
  const price = rawPrice ? Number(String(rawPrice).replace(/[^\d.]/g, '')) || null : null
  const detectedTags = new Set([...(nextData.tags ?? []), ...jsonLd.tags, ...riskTagsFromText(html)])
  const tags = PRODUCT_RISK_TAGS.filter((tag) => detectedTags.has(tag))
  return { name, image, price, tags }
}
