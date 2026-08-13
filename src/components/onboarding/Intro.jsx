import Button from '../Button'

export default function Intro({ onNext }) {
  return (
    <div className='flex flex-col items-center h-full bg-white px-6 pb-[42px]'>
      <div className='flex-[3] min-h-6' />

      <div
        className='text-title font-bold text-gray-800 text-center'
        style={{ letterSpacing: '-0.4px' }}
      >
        <p style={{ lineHeight: 1.5, whiteSpace: 'pre' }}>반가워요!</p>
        <p style={{ lineHeight: 1.5, whiteSpace: 'pre' }}>{'​'}</p>
        <p style={{ lineHeight: 1.5, whiteSpace: 'pre' }}>비포바이는 합리적인 소비를 위해</p>
        <p style={{ lineHeight: 1.5, whiteSpace: 'pre' }}>구매 전 조언해주는 AI 서비스에요.</p>
      </div>

      <div className='flex-[1] min-h-4' />

      <img
        src='/intro-character.png'
        alt=''
        className='w-full max-w-[374px] max-h-[249px] object-contain min-h-0 shrink'
      />

      <div className='flex-[3] min-h-4' />

      <Button onClick={onNext} variant='dark' className='shrink-0'>
        다음으로
      </Button>
    </div>
  )
}
