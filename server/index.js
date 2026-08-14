import express from 'express'
import parseProduct from './parse-product.js'

const app = express()
const PORT = process.env.PORT || 3001

const PRIVATE_HOST = /^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|0\.|\[)/i

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
    const response = await fetch(parsed, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        accept: 'text/html,application/xhtml+xml',
        'accept-language': 'ko-KR,ko;q=0.9',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) {
      return res.status(502).json({ error: `상품 페이지 응답 오류 (${response.status})` })
    }
    const html = await response.text()
    const product = parseProduct(html)
    if (!product.name && !product.image) {
      return res.status(422).json({ error: '상품 정보를 찾지 못했어요' })
    }
    return res.json(product)
  } catch {
    return res.status(502).json({ error: '상품 페이지를 불러오지 못했어요' })
  }
})

app.listen(PORT, () => {
  console.log(`API server: http://localhost:${PORT}`)
})
