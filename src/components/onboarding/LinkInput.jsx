import { useState } from 'react'
import Button from '../Button'
import Input from '../Input'
import Header from '../Header'
import SearchIcon from '../icons/SearchIcon'
import BottomSheetPage from '../BottomSheetPage'

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
    <BottomSheetPage
      header={<Header onBack={onBack} />}
      title={
        <>
          <p className='text-title font-bold text-gray-800 whitespace-nowrap'>
            사고 싶은 상품의 링크를 알려주세요.
          </p>
          <p className='text-gray-500 font-medium whitespace-nowrap'
            style={{ fontSize: '13px', letterSpacing: '-0.13px', lineHeight: 1.5 }}>
            알려주신 상품은 비포바이가 이후에도 기억할게요!
          </p>
        </>
      }
    >
      <Input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder='이곳에 구매 링크를 붙여넣어 볼까요?'
        invalid={invalid}
        icon={<SearchIcon className='shrink-0 text-gray-500' />}
        bordered
        className='h-14'
      />

      {invalid && (
        <p className='mt-2.5 px-2.5 text-error font-medium'
          style={{ fontSize: '12px', letterSpacing: '-0.12px', lineHeight: 1.5 }}>
          잘못된 링크 주소예요. 다시 확인해주세요!
        </p>
      )}

      <div className='mt-auto pt-4'>
        <Button onClick={() => onNext(link.trim())} variant={link && !invalid ? 'dark' : 'default'}>
          분석 맡기기
        </Button>
      </div>
    </BottomSheetPage>
  )
}
