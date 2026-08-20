// 게이지 아래 판정 문구
export default function Verdict({ title, subtitle }) {
  return (
    <div className='flex w-full flex-col items-center gap-2 text-center'>
      <p className='text-price text-gray-800'>{title}</p>
      <p className='w-full whitespace-pre-line text-body2 text-gray-600'>{subtitle}</p>
    </div>
  )
}
