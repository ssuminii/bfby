import { useEffect, useState } from 'react'
import Button from '../Button'
import fetchProductInfo from '../../utils/fetchProductInfo'

function ProductSkeleton() {
  return (
    <div role='status' aria-label='상품 정보를 불러오는 중' className='animate-pulse'>
      <div className='h-[210px] rounded-[24px] bg-gray-100' />
      <div className='mt-5 h-6 w-full rounded-md bg-gray-100' />
      <div className='mt-2 h-6 w-3/4 rounded-md bg-gray-100' />
      <div className='mt-4 h-7 w-1/3 rounded-md bg-gray-100' />
      <div className='mt-4 flex gap-2'>
        <div className='h-[30px] w-20 rounded-full bg-gray-100' />
        <div className='h-[30px] w-24 rounded-full bg-gray-100' />
        <div className='h-[30px] w-16 rounded-full bg-gray-100' />
      </div>
      <span className='sr-only'>상품 정보를 불러오고 있어요.</span>
    </div>
  )
}

export default function ProductConfirm({ link, onNext, onBack }) {
  const [product, setProduct] = useState(null)
  const [fetchStatus, setFetchStatus] = useState(link ? 'loading' : 'error')
  const [phase, setPhase] = useState('idle') // idle | loading | done

  // 링크에서 상품 정보 조회
  useEffect(() => {
    if (!link) {
      setFetchStatus('error')
      return
    }

    let alive = true
    setProduct(null)
    setFetchStatus('loading')

    fetchProductInfo(link).then((info) => {
      if (!alive) return
      if (!info) {
        setFetchStatus('error')
        return
      }

      setProduct({
        name: info.name ?? '상품명 정보 없음',
        image: info.image ?? null,
        price: info.price ?? null,
        tags: info.tags ?? [],
      })
      setFetchStatus('ready')
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
  }, [phase, onNext, product])

  return (
    <div className='relative flex flex-col h-full bg-white'>
      <div className='h-[26%] min-h-[110px] shrink flex items-end justify-center px-6 pb-[38px]'>
        <p
          className='text-title font-bold text-gray-800 text-center whitespace-nowrap'
          style={{ letterSpacing: '-0.4px', lineHeight: 1.5 }}
        >
          {fetchStatus === 'loading'
            ? '상품 정보를 불러오고 있어요'
            : fetchStatus === 'error'
              ? '상품 정보를 불러오지 못했어요'
              : '사고 싶은 상품이 이 상품이 맞나요?'}
        </p>
      </div>

      <div
        className='flex-1 min-h-0 flex flex-col bg-gray-50 rounded-tl-[50px] rounded-tr-[50px] drop-shadow-[0px_0px_3px_rgba(0,0,0,0.12)] px-6 pt-6 pb-[42px]'
        aria-busy={fetchStatus === 'loading'}
      >
        {fetchStatus === 'loading' && <ProductSkeleton />}

        {fetchStatus === 'error' && (
          <div className='flex flex-1 flex-col items-center justify-center text-center'>
            <p className='text-body1 font-bold text-gray-800'>링크에서 상품 정보를 찾지 못했어요.</p>
            <p className='mt-2 text-body2 font-medium text-gray-600'>다른 상품 링크로 다시 시도해 주세요.</p>
            <Button onClick={onBack} variant='dark' className='mt-8'>
              링크 다시 입력하기
            </Button>
          </div>
        )}

        {fetchStatus === 'ready' && product && (
          <>
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

            {product.price !== null && (
              <p
                className='mt-3 text-price font-bold text-gray-800'
                style={{ letterSpacing: '-0.22px', lineHeight: 1.5 }}
              >
                {product.price.toLocaleString()}원
              </p>
            )}

            {product.tags.length > 0 && (
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
            )}

            <div className='mt-auto pt-4 flex flex-col gap-3'>
              <Button onClick={() => setPhase('loading')} variant='dark'>
                맞아요, 시작하기
              </Button>
              <Button onClick={onBack} variant='secondary'>
                이 링크가 아니에요
              </Button>
            </div>
          </>
        )}
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
