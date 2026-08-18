import { useRef, useState } from 'react'
import cameraIcon from '../../assets/icons/camera.svg'
import checkListIcon from '../../assets/icons/check-list.svg'
import Button from '../Button'
import Header from '../Header'

const CATEGORIES = ['의류', '뷰티', '전자기기', '생활용품', '식품', '취미·운동', '기타']

const formatPrice = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 12)
  return digits ? Number(digits).toLocaleString('ko-KR') : ''
}

export default function ManualProductInput({ onBack, onSubmit }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState(null)
  const [imageName, setImageName] = useState('')
  const fileInputRef = useRef(null)

  const priceNumber = Number(price.replace(/,/g, ''))
  const canSubmit = Boolean(name.trim() && priceNumber > 0 && category)

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setImage(typeof reader.result === 'string' ? reader.result : null)
      setImageName(file.name)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit({
      name: name.trim(),
      price: priceNumber,
      category,
      tags: [category],
      image,
    })
  }

  return (
    <div className='flex flex-col h-full bg-gray-50'>
      <Header title='직접 입력' onBack={onBack} />

      <div className='flex-1 overflow-y-auto px-6 pt-6 pb-4'>
        <div className='flex flex-col gap-12'>
          <section className='flex flex-col gap-4'>
            <label htmlFor='manual-product-name' className='text-head text-gray-800'>
              상품명
            </label>
            <div className='flex flex-col gap-2'>
              <input
                id='manual-product-name'
                type='text'
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={100}
                placeholder='예: 갤럭시 탭 S9 울트라 256GB 14.6인치 베이지'
                className='h-[50px] w-full rounded-2xl bg-white px-4 text-body1 text-gray-800 outline-none placeholder:text-gray-600 focus:ring-2 focus:ring-blue-300'
              />
              <p className='text-caption text-gray-500'>
                * 자세히 적어주실수록 더욱 정확한 분석이 가능해요.
              </p>
            </div>
          </section>

          <section className='flex flex-col gap-4'>
            <label htmlFor='manual-product-price' className='text-head text-gray-800'>
              상품 금액
            </label>
            <input
              id='manual-product-price'
              type='text'
              inputMode='numeric'
              value={price}
              onChange={(event) => setPrice(formatPrice(event.target.value))}
              placeholder='금액을 입력해 주세요.'
              className='h-[50px] w-full rounded-2xl bg-white px-4 text-body1 text-gray-800 outline-none placeholder:text-gray-600 focus:ring-2 focus:ring-blue-300'
            />
          </section>

          <section className='flex flex-col gap-4'>
            <h2 className='text-head text-gray-800'>종류</h2>
            <div className='grid h-[76px] grid-cols-4 grid-rows-2 gap-x-4 gap-y-3'>
              {CATEGORIES.map((item) => {
                const selected = category === item
                return (
                  <button
                    key={item}
                    type='button'
                    onClick={() => setCategory(item)}
                    aria-pressed={selected}
                    className={`min-w-16 rounded-[4px] text-body2 font-bold transition-colors ${
                      selected
                        ? 'bg-blue-100 text-blue-700 ring-2 ring-inset ring-blue-500'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item}
                  </button>
                )
              })}
            </div>
          </section>

          <section className='flex flex-col gap-6'>
            <h2 className='text-head text-gray-800'>
              사진 추가 <span className='text-gray-500'>(선택)</span>
            </h2>

            <div className='flex flex-col gap-2'>
              <p className='whitespace-nowrap text-caption text-gray-600'>
                다음과 같은 정보가 포함되면 더욱 정확한 분석 결과를 얻을 수 있어요.
              </p>
              <div className='flex items-center gap-2'>
                <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100'>
                  <img src={checkListIcon} alt='' className='h-[8px] w-[10px]' />
                </span>
                <p className='text-caption text-gray-600'>
                  상품 이미지 / 가격 / 할인율 / 리뷰 평점 및 갯수
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='sr-only'
            />
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='flex h-[102px] w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 bg-white px-[10px] py-4'
            >
              <span className='flex size-9 items-center justify-center overflow-hidden'>
                <img src={cameraIcon} alt='' className='h-6 w-[27px]' />
              </span>
              <span className='max-w-full truncate text-head text-gray-500'>
                {imageName || '사진 추가'}
              </span>
            </button>
          </section>
        </div>
      </div>

      <div className='px-6 pb-10 pt-4 shrink-0'>
        <Button onClick={handleSubmit} variant={canSubmit ? 'dark' : 'default'} className='text-head'>
          분석 시작
        </Button>
      </div>
    </div>
  )
}
