import { useState } from 'react'
import Button from '../Button'
import Input from '../Input'
import Header from '../Header'
import SearchIcon from '../icons/SearchIcon'

const isValidUrl = (value) => {
  const m = /^(https?:\/\/)?([^\s/:?#]+)([:/?#]\S*)?$/i.exec(value.trim())
  if (!m) return false
  const labels = m[2].split('.')
  if (labels.some((l) => !/^[\w-]+$/.test(l))) return false
  if (!/^[a-z]{2,}$/i.test(labels[labels.length - 1])) return false
  // www.coup 처럼 www 뒤에 실제 도메인+TLD가 없는 경우는 무효
  return labels.length >= (labels[0].toLowerCase() === 'www' ? 3 : 2)
}

export default function LinkInput({ onNext, onBack }) {
  const [link, setLink] = useState('')
  const invalid = link !== '' && !isValidUrl(link)

  return (
    <div className='flex flex-col h-full bg-white'>
      <Header onBack={onBack} />
      <div className='h-[33%] min-h-[130px] shrink flex flex-col items-center justify-end gap-[10px] text-center px-6 pb-[54px] pt-10'>
        <p
          className='text-title font-bold text-gray-800 whitespace-nowrap'
          style={{ letterSpacing: '-0.4px', lineHeight: 1.5 }}
        >
          사고 싶은 상품의 링크를 알려주세요.
        </p>
        <p
          className='text-gray-500 font-medium whitespace-nowrap'
          style={{ fontSize: '13px', letterSpacing: '-0.13px', lineHeight: 1.5 }}
        >
          알려주신 상품은 비포바이가 이후에도 기억할게요!
        </p>
      </div>

      <div className='flex-1 min-h-0 flex flex-col bg-gray-50 rounded-tl-[50px] rounded-tr-[50px] drop-shadow-[0px_0px_3px_rgba(0,0,0,0.12)] px-6 pt-[44px] pb-[42px]'>
        <Input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder='이곳에 구매 링크를 붙여넣어 볼까요?'
          invalid={invalid}
          icon={<SearchIcon className='shrink-0 text-gray-500' />}
          className='h-14'
        />

        {invalid && (
          <p
            className='mt-[10px] px-[10px] text-error font-medium'
            style={{ fontSize: '12px', letterSpacing: '-0.12px', lineHeight: 1.5 }}
          >
            잘못된 링크 주소예요. 다시 확인해주세요!
          </p>
        )}

        <div className='mt-auto pt-4'>
          <Button onClick={() => onNext(link.trim())} variant={link && !invalid ? 'dark' : 'default'}>
            분석 맡기기
          </Button>
        </div>
      </div>
    </div>
  )
}
