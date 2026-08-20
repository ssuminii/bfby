import test from 'node:test'
import assert from 'node:assert/strict'
import parseProduct from './parse-product.js'

test('trailing comma가 있는 JSON-LD에서도 가격을 추출하고 일반 정보는 태그로 쓰지 않는다', () => {
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
    tags: [],
  })
})

test('구매 전 놓치기 쉬운 조건만 상품 태그로 추출한다', () => {
  const html = `
    <meta property="og:title" content="해외 한정판 스니커즈">
    <meta property="og:image" content="https://example.com/shoes.jpg">
    <meta name="description" content="해외 한정판 스니커즈, 교환/반품 불가 상품입니다.">
    <script type="application/ld+json">
      {
        "@type": "Product",
        "name": "해외 한정판 스니커즈",
        "offers": {
          "@type": "Offer",
          "price": "129000",
          "availability": "https://schema.org/LimitedAvailability",
          "shippingDetails": {
            "shippingRate": { "value": "3000", "currency": "KRW" },
            "shippingOrigin": { "addressCountry": "US" }
          }
        }
      }
    </script>
  `

  assert.deepEqual(parseProduct(html), {
    name: '해외 한정판 스니커즈',
    image: 'https://example.com/shoes.jpg',
    price: 129000,
    tags: ['품절 임박', '반품 불가', '교환 불가', '배송비 별도', '해외 배송'],
  })
})

test('Next.js 상품 데이터는 일반 description 문구보다 우선한다', () => {
  const html = `
    <title>스투시 x 아워레가시 서프맨 피그먼트 다이드 반팔 티셔츠 내츄럴 3904017 - 4910 | 사고 싶은 스타일의 발견</title>
    <meta name="description" content="덜 고민하고, 더 나답게 고르는 패션">
    <meta property="og:image" content="https://example.com/detail.jpg">
    <script id="__NEXT_DATA__" type="application/json">
      {
        "props": {
          "pageProps": {
            "serverQueryClient": {
              "queries": [
                {
                  "state": {
                    "data": {
                      "goods": {
                        "name": "스투시 x 아워레가시 서프맨 피그먼트 다이드 반팔 티셔츠 내츄럴 3904017",
                        "price": 114000,
                        "image": "https://example.com/thumb.jpg",
                        "delivery_fee": null,
                        "is_limited": false,
                        "is_overseas_delivery": false
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      }
    </script>
  `

  assert.deepEqual(parseProduct(html), {
    name: '스투시 x 아워레가시 서프맨 피그먼트 다이드 반팔 티셔츠 내츄럴 3904017',
    image: 'https://example.com/detail.jpg',
    price: 114000,
    tags: [],
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
