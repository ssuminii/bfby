import Button from '../Button'
import ChevronLeftIcon from '../icons/ChevronLeftIcon'
import SearchIcon from '../icons/SearchIcon'

export default function ProductFetchError({ link, onBack, onManualInput }) {
  return (
    <div className='relative h-full bg-white'>
      <header className='absolute inset-x-0 top-0 z-10 h-[120px] bg-white'>
        <button
          type='button'
          onClick={onBack}
          aria-label='뒤로 가기'
          className='absolute bottom-0 left-2 flex size-12 items-center justify-center bg-transparent text-black'
        >
          <ChevronLeftIcon />
        </button>
      </header>

      <div className='absolute inset-x-6 top-[160px] flex flex-col items-center gap-[10px] text-center'>
        <h1 className='text-title text-black'>페이지를 읽지 못했어요.</h1>
        <p className='text-body2 text-gray-600'>
          로그인이 필요한 페이지거나,
          <br />
          아직 지원하지 않는 쇼핑몰이에요.
        </p>
      </div>

      <section className='absolute inset-x-0 bottom-0 top-[280px] flex flex-col rounded-t-[50px] bg-gray-50 px-6 pb-10 pt-6 drop-shadow-[0_0_3px_rgba(0,0,0,0.12)]'>
        <div className='flex h-14 w-full items-center gap-[10px] rounded-2xl border-2 border-error bg-white px-[30px]'>
          <SearchIcon className='shrink-0 text-gray-600' />
          <p
            className='min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-body2 text-gray-600'
            title={link}
          >
            {link}
          </p>
        </div>

        <div className='mt-auto flex flex-col gap-2'>
          <Button onClick={onManualInput} variant='dark' className='text-head'>
            직접 입력할게요
          </Button>
          <Button onClick={onBack} variant='secondary' className='text-head text-gray-600'>
            다른 링크 입력
          </Button>
        </div>
      </section>
    </div>
  )
}
