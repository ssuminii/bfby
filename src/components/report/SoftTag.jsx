// 근거의 출처를 밝히는 칩
export default function SoftTag({ children }) {
  return (
    <span className='inline-flex h-7 items-center justify-center rounded-[19.2px] bg-blue-100 px-3 text-body2b text-blue-600'>
      {children}
    </span>
  )
}
