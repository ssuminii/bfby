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

test('KREAM 상품은 영문 og:title보다 국문 상품명을 우선한다', () => {
  const html = `
    <title>비비안 웨스트우드 미니 바스 릴리프 오브 펜던트 루테늄 블랙 다이아몬드 정품 안심 거래 | KREAM</title>
    <meta property="og:title" content="Vivienne Westwood Mini Bas Relief Orb Pendant Ruthenium Black Diamond">
    <meta property="og:description" content="비비안 웨스트우드 미니 바스 릴리프 오브 펜던트 루테늄 블랙 다이아몬드(63020104-02S108/S108-CN), 정품 검수 완료, 실시간 시세 확인">
    <meta name="keywords" content="63020104-02S108/S108-CN,비비안 웨스트우드 미니 바스 릴리프 오브 펜던트 루테늄 블랙 다이아몬드,Vivienne Westwood Mini Bas Relief Orb Pendant Ruthenium Black Diamond">
    <meta property="og:image" content="https://example.com/kream.png">
    <meta property="product:price:amount" content="228000">
  `

  assert.deepEqual(parseProduct(html), {
    name: '비비안 웨스트우드 미니 바스 릴리프 오브 펜던트 루테늄 블랙 다이아몬드',
    image: 'https://example.com/kream.png',
    price: 228000,
    tags: [],
  })
})

test('KREAM description의 모델번호 괄호를 제거해 국문 상품명을 추출한다', () => {
  const html = `
    <meta property="og:title" content="Vivienne Westwood Mini Bas Relief Orb Pendant Ruthenium Black Diamond">
    <meta property="og:description" content="비비안 웨스트우드 미니 바스 릴리프 오브 펜던트 루테늄 블랙 다이아몬드(63020104-02S108/S108-CN), 정품 검수 완료, 실시간 시세 확인">
  `

  assert.equal(
    parseProduct(html).name,
    '비비안 웨스트우드 미니 바스 릴리프 오브 펜던트 루테늄 블랙 다이아몬드',
  )
})
