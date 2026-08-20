// **로 감싼 곳만 btm_nav 스타일(text-emphasis)로 굵게 뽑는다.
// 카테고리 이름, 후회 비율, 조건절처럼 문장에서 눈이 먼저 가야 하는 대목에 쓴다.
const EMPHASIS = /\*\*(.+?)\*\*/g

export default function Muted({ children }) {
  const parts = String(children ?? '').split(EMPHASIS)

  return (
    <p className='whitespace-pre-line text-result text-gray-600'>
      {parts.map((part, index) =>
        // split의 캡처 그룹이라 홀수 번째가 강조 구간이다
        index % 2 ? (
          <b key={index} className='text-emphasis'>
            {part}
          </b>
        ) : (
          part
        ),
      )}
    </p>
  )
}
