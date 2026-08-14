// 링크에서 상품 정보(name, image, price)를 조회. 실패하면 null 반환 → 호출부에서 목데이터 유지
export default async function fetchProductInfo(link) {
  try {
    const res = await fetch(`/api/product-info?url=${encodeURIComponent(link)}`)
    if (!res.ok) return null
    const data = await res.json()
    if (!data.name && !data.image) return null
    return data
  } catch {
    return null
  }
}
