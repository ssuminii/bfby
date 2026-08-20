import parseProduct from './parse-product.js'

const PRIVATE_HOST = /^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|0\.|\[)/i
const PRODUCT_FETCH_TIMEOUT_MS = 15000
const PRODUCT_FETCH_RETRIES = 2
const PRODUCT_CACHE_TTL_MS = 10 * 60 * 1000
const productCache = new Map()
const pendingProductRequests = new Map()

const PRODUCT_PAGE_HEADERS = {
  'user-agent':
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) ' +
    'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'accept-language': 'ko-KR,ko;q=0.9',
  'cache-control': 'no-cache',
  pragma: 'no-cache',
}

export function normalizeProductUrl(rawUrl) {
  if (!rawUrl) {
    const error = new Error('url 파라미터가 필요해요')
    error.status = 400
    throw error
  }

  const target = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`
  let parsed

  try {
    parsed = new URL(target)
  } catch {
    const error = new Error('올바른 URL이 아니에요')
    error.status = 400
    throw error
  }

  if (PRIVATE_HOST.test(parsed.hostname)) {
    const error = new Error('허용되지 않는 주소예요')
    error.status = 400
    throw error
  }

  return parsed
}

async function fetchProductPage(url) {
  let lastError

  for (let attempt = 1; attempt <= PRODUCT_FETCH_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: PRODUCT_PAGE_HEADERS,
        redirect: 'follow',
        signal: AbortSignal.timeout(PRODUCT_FETCH_TIMEOUT_MS),
      })

      if (response.ok || response.status < 500 || attempt === PRODUCT_FETCH_RETRIES) {
        return response
      }
    } catch (error) {
      lastError = error
      if (attempt === PRODUCT_FETCH_RETRIES) throw lastError
    }
  }

  throw lastError
}

function getCachedProduct(url) {
  const cached = productCache.get(url)
  if (!cached) return null

  if (Date.now() - cached.createdAt > PRODUCT_CACHE_TTL_MS) {
    productCache.delete(url)
    return null
  }

  return cached.product
}

export async function loadProduct(url) {
  const cacheKey = url.href
  const cached = getCachedProduct(cacheKey)
  if (cached) return cached

  const pending = pendingProductRequests.get(cacheKey)
  if (pending) return pending

  const request = (async () => {
    const response = await fetchProductPage(url)
    if (!response.ok) {
      const error = new Error(`상품 페이지 응답 오류 (${response.status})`)
      error.status = 502
      throw error
    }

    const html = await response.text()
    const product = parseProduct(html)
    if (product.name || product.image) {
      productCache.set(cacheKey, { product, createdAt: Date.now() })
    }
    return product
  })()

  pendingProductRequests.set(cacheKey, request)

  try {
    return await request
  } finally {
    pendingProductRequests.delete(cacheKey)
  }
}

export async function getProductInfo(rawUrl) {
  const parsed = normalizeProductUrl(rawUrl)
  const product = await loadProduct(parsed)

  if (!product.name && !product.image) {
    const error = new Error('상품 정보를 찾지 못했어요')
    error.status = 422
    throw error
  }

  return product
}
