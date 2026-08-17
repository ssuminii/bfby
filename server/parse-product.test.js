import test from 'node:test'
import assert from 'node:assert/strict'
import parseProduct from './parse-product.js'

test('trailing comma가 있는 JSON-LD에서도 가격과 상품 태그를 추출한다', () => {
  const html = `
    <meta property="og:title" content="슈틸루스터 헤어스타일러">
    <meta property="og:image" content="https://example.com/product.jpg">
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            "name": "슈틸루스터 헤어스타일러",
            "brand": { "@type": "Brand", "name": "슈틸루스터" },
            "offers": {
              "@type": "Offer",
              "price": "219000",
              "availability": "https://schema.org/InStock",
              "shippingDetails": {
                "shippingRate": { "value": "0", "currency": "KRW", },
              },
            },
          },
        ]
      }
    </script>
  `

  assert.deepEqual(parseProduct(html), {
    name: '슈틸루스터 헤어스타일러',
    image: 'https://example.com/product.jpg',
    price: 219000,
    tags: ['슈틸루스터', '재고 있음', '무료배송'],
  })
})

test('문자열 안의 쉼표는 JSON-LD 정규화 과정에서 유지한다', () => {
  const html = `
    <script type="application/ld+json">
      {
        "@type": "Product",
        "name": "가볍고, 빠른 헤어스타일러",
        "offers": { "price": "219000", },
      }
    </script>
  `

  assert.equal(parseProduct(html).name, '가볍고, 빠른 헤어스타일러')
})
