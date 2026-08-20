import express from 'express'
import parseProduct from './parse-product.js'

const app = express()
const PORT = process.env.PORT || 3001

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

async function loadProduct(url) {
  const cacheKey = url.href
  const cached = getCachedProduct(cacheKey)
  if (cached) return cached

  const pending = pendingProductRequests.get(cacheKey)
  if (pending) return pending

  const request = (async () => {
    const response = await fetchProductPage(url)
    if (!response.ok) {
      const error = new Error(`Product page response error (${response.status})`)
      error.status = response.status
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

// Render 헬스체크용
app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.get('/api/product-info', async (req, res) => {
  const rawUrl = req.query.url
  if (!rawUrl) return res.status(400).json({ error: 'url 파라미터가 필요해요' })

  const target = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`
  let parsed
  try {
    parsed = new URL(target)
  } catch {
    return res.status(400).json({ error: '올바른 URL이 아니에요' })
  }
  if (PRIVATE_HOST.test(parsed.hostname)) {
    return res.status(400).json({ error: '허용되지 않는 주소예요' })
  }

  try {
    const product = await loadProduct(parsed)
    if (!product.name && !product.image) {
      return res.status(422).json({ error: '상품 정보를 찾지 못했어요' })
    }
    return res.json(product)
  } catch (error) {
    const message = error.status
      ? `상품 페이지 응답 오류 (${error.status})`
      : '상품 페이지를 불러오지 못했어요'

    return res
      .status(502)
      .json({ error: message })
  }
})

app.listen(PORT, () => {
  console.log(`API server: http://localhost:${PORT}`)
})
