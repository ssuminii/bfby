// 산출 근거를 먼저 보여주고 그 결과로 금액이 따라온다
export default function Amount({ value, formula }) {
  return (
    <div className='flex w-full flex-col gap-3'>
      {formula && (
        <p className='whitespace-pre-line text-body2 font-semibold text-gray-500'>{formula}</p>
      )}
      <p className='text-display text-gray-800'>{value}</p>
    </div>
  )
}
