import { getProductInfo } from '../../server/product-service.js'

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'content-type': 'application/json; charset=utf-8',
  },
  body: JSON.stringify(body),
})

export async function handler(event) {
  try {
    const product = await getProductInfo(event.queryStringParameters?.url)
    return json(200, product)
  } catch (error) {
    return json(error.status ?? 502, {
      error: error.message || '상품 페이지를 불러오지 못했어요',
    })
  }
}
