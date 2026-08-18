/**
 * 카드가 쌓이기 전까지 보관함 그리드를 채워두는 임시 데이터.
 * 실제 기록이 6장을 넘으면 쓰이지 않는다. 데이터가 붙으면 이 파일은 지운다.
 *
 * 금액은 세 등급이 모두 보이도록 골랐다 (골드 100만 / 실버 10만 / 그 이하 브론즈).
 */
export const SAMPLE_SPENDING_CARDS = [
  { at: 'sample-1', name: '노트북', category: '전자기기', price: 1_690_000 },
  { at: 'sample-2', name: '공기청정기', category: '전자기기', price: 399_000 },
  { at: 'sample-3', name: '러닝화', category: '취미·운동', price: 129_000 },
  { at: 'sample-4', name: '비타민 세럼', category: '뷰티', price: 45_000 },
  { at: 'sample-5', name: '프로틴', category: '식품', price: 68_000 },
  { at: 'sample-6', name: '요가매트', category: '취미·운동', price: 52_000 },
]
