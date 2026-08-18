import Button from '../Button'
import Header from '../Header'
import SearchIcon from '../icons/SearchIcon'

export default function ProductFetchError({ link, onBack, onManualInput }) {
  return (
    <div className='flex flex-col h-full bg-white'>
      <Header onBack={onBack} />

      <div className='flex flex-col items-center gap-2.5 text-center px-6 pt-10 pb-6'>
        <h1 className='text-title text-black'>페이지를 읽지 못했어요.</h1>
        <p className='text-body2 text-gray-600'>
          로그인이 필요한 페이지거나,
          <br />
          아직 지원하지 않는 쇼핑몰이에요.
        </p>
      </div>

      <section className='flex-1 flex flex-col rounded-t-[50px] bg-gray-50 px-6 pb-10 pt-6 drop-shadow-[0_0_3px_rgba(0,0,0,0.12)]'>
        <div className='flex h-14 w-full items-center gap-2.5 rounded-2xl border-2 border-error bg-white px-7.5'>
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
