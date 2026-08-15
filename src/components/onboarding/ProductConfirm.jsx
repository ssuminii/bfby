import { useEffect, useState } from 'react'
import Button from '../Button'
import fetchProductInfo from '../../utils/fetchProductInfo'

const MOCK_PRODUCT = {
  image: null,
  name: '갤럭시 탭 S9 울트라 256GB 14 6인치 Wi-Fi 6E 안드로이드 태블릿 – 베이지 갱신',
  price: 219000,
  tags: ['특징태그', '특징태그', '특징태그'],
}

export default function ProductConfirm({ link, onNext, onBack }) {
  const [product, setProduct] = useState(MOCK_PRODUCT)
  const [phase, setPhase] = useState('idle') // idle | loading | done

  // 링크에서 상품 정보 조회 — 실패하면 목데이터 유지
  useEffect(() => {
    if (!link) return
    let alive = true
    fetchProductInfo(link).then((info) => {
      if (!alive || !info) return
      setProduct((prev) => ({
        ...prev,
        name: info.name ?? prev.name,
        image: info.image ?? prev.image,
        price: info.price ?? prev.price,
      }))
    })
    return () => {
      alive = false
    }
  }, [link])

  useEffect(() => {
    if (phase === 'idle') return
    const timer = setTimeout(
      () => (phase === 'loading' ? setPhase('done') : onNext(product)),
      phase === 'loading' ? 2200 : 2000,
    )
    return () => clearTimeout(timer)
  }, [phase, onNext])

  return (
    <div className='relative flex flex-col h-full bg-white'>
      <div className='h-[26%] min-h-[110px] shrink flex items-end justify-center px-6 pb-[38px]'>
        <p
          className='text-title font-bold text-gray-800 text-center whitespace-nowrap'
          style={{ letterSpacing: '-0.4px', lineHeight: 1.5 }}
        >
          사고 싶은 상품이 이 상품이 맞나요?
        </p>
      </div>

      <div className='flex-1 min-h-0 flex flex-col bg-gray-50 rounded-tl-[50px] rounded-tr-[50px] drop-shadow-[0px_0px_3px_rgba(0,0,0,0.12)] px-6 pt-6 pb-[42px]'>
        <div className='h-[210px] shrink-0 flex items-center justify-center bg-white rounded-[24px] overflow-hidden'>
          {product.image && (
            <img src={product.image} alt='' className='max-w-full max-h-full object-contain' />
          )}
        </div>

        <p
          className='mt-5 text-body1 font-medium text-gray-800'
          style={{ letterSpacing: '-0.16px', lineHeight: 1.5 }}
        >
          {product.name}
        </p>

        <p
          className='mt-3 text-price font-bold text-gray-800'
          style={{ letterSpacing: '-0.22px', lineHeight: 1.5 }}
        >
          {product.price.toLocaleString()}원
        </p>

        <div className='mt-4 flex flex-wrap gap-2'>
          {product.tags.map((tag, i) => (
            <span
              key={i}
              className='flex items-center h-[30px] px-4 rounded-full bg-white border border-gray-100 text-gray-500 font-medium'
              style={{ fontSize: '12px', letterSpacing: '-0.12px' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className='mt-auto pt-4 flex flex-col gap-3'>
          <Button onClick={() => setPhase('loading')} variant='dark'>
            맞아요, 시작하기
          </Button>
          <Button onClick={onBack} variant='secondary'>
            이 링크가 아니에요
          </Button>
        </div>
      </div>

      {phase !== 'idle' && (
        <div className='absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80'>
          {phase === 'loading' ? (
            <>
              <div className='w-[64px] h-[64px] rounded-full border-4 border-white/20 border-t-white animate-spin' />
              <p
                className='mt-8 text-title font-bold text-white text-center'
                style={{ letterSpacing: '-0.4px', lineHeight: 1.5 }}
              >
                상품을 열심히 분석하고 있어요...
              </p>
            </>
          ) : (
            <>
              <p
                className='text-title font-bold text-white text-center'
                style={{ letterSpacing: '-0.4px', lineHeight: 1.5 }}
              >
                상품 분석 완료!
              </p>
              <p
                className='mt-10 text-title font-bold text-white text-center whitespace-pre-line'
                style={{ letterSpacing: '-0.4px', lineHeight: 1.5 }}
              >
                {'구매를 조언하기 전\n4가지만 가볍게 여쭤볼게요.'}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
