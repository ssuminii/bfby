import express from 'express'
import { getProductInfo } from './product-service.js'

const app = express()
const PORT = process.env.PORT || 3001

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.get('/api/product-info', async (req, res) => {
  try {
    const product = await getProductInfo(req.query.url)
    return res.json(product)
  } catch (error) {
    return res
      .status(error.status ?? 502)
      .json({ error: error.message || '상품 페이지를 불러오지 못했어요' })
  }
})

app.listen(PORT, () => {
  console.log(`API server: http://localhost:${PORT}`)
})
