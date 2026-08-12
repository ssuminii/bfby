import Button from '../Button'

export default function Intro({ onNext }) {
  return (
    <div className='relative w-full h-full bg-gradient-to-b from-blue-300 to-blue-50'>
      <img src='/intro-bg.svg' alt='' className='absolute inset-0 w-full h-full' />

      <div
        className='absolute -translate-x-1/2 text-title font-bold text-gray-800 text-center'
        style={{ top: '166px', left: '196.5px', letterSpacing: '-0.4px', lineHeight: 0, whiteSpace: 'nowrap' }}
      >
        <p style={{ lineHeight: 1.5, marginBottom: 0, whiteSpace: 'pre' }}>반가워요!</p>
        <p style={{ lineHeight: 1.5, marginBottom: 0, whiteSpace: 'pre' }}>{'​'}</p>
        <p style={{ lineHeight: 1.5, marginBottom: 0, whiteSpace: 'pre' }}>비포바이는 합리적인 소비를 위해</p>
        <p style={{ lineHeight: 1.5, whiteSpace: 'pre' }}>구매 전 조언해주는 AI 서비스에요.</p>
      </div>

      <div
        className='absolute left-1/2 -translate-x-1/2 -translate-y-1/2'
        style={{ top: 'calc(50% + 40.5px)', width: '374px', height: '249px' }}
      >
        <img src='/intro-character.png' alt='' className='absolute inset-0 w-full h-full object-cover' />
      </div>

      <div className='absolute' style={{ top: '758px', left: '24px' }}>
        <Button onClick={onNext} variant='dark'>다음으로</Button>
      </div>
    </div>
  )
}
