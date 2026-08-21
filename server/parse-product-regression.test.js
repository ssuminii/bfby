import test from 'node:test'
import assert from 'node:assert/strict'
import parseProduct from './parse-product.js'

test('non-KREAM Korean descriptions do not override the product title', () => {
  const html = `
    <meta property="og:url" content="https://www.musinsa.com/products/6246831">
    <meta property="og:title" content="제이미웨스트(JAMIE WEST) 언테임드 타이거 프레임 티셔츠 (화이트) - 사이즈 &amp; 후기 | 무신사">
    <meta property="og:description" content="제품분류 :스포츠/레저 &gt; 상의 브랜드 : 제이미웨스트(JAMIE WEST) 제품번호 : JWB-TS452WH1 제품 : 언테임드 타이거 프레임 티셔츠 (화이트) - 37,800">
  `

  assert.equal(parseProduct(html).name, '언테임드 타이거 프레임 티셔츠 (화이트)')
})

test('non-KREAM Korean keywords do not select a brand as the product name', () => {
  const html = `
    <meta property="og:title" content="뷰티크 [메종마르지엘라] 레이지 선데이 모닝 오 드 뚜왈렛 화이트머스크향 100ml">
    <meta name="keywords" content="뷰티크, [메종마르지엘라] 레이지 선데이 모닝 오 드 뚜왈렛 화이트머스크향 100ml, ">
    <script type="application/ld+json">
      {
        "@type": "Product",
        "name": "뷰티크 [메종마르지엘라] 레이지 선데이 모닝 오 드 뚜왈렛 화이트머스크향 100ml",
        "offers": { "price": "107900" }
      }
    </script>
  `

  assert.equal(
    parseProduct(html).name,
    '뷰티크 [메종마르지엘라] 레이지 선데이 모닝 오 드 뚜왈렛 화이트머스크향 100ml',
  )
})
