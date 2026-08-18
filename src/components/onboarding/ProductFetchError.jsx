import Button from '../Button'
import Header from '../Header'
import Input from '../Input'
import SearchIcon from '../icons/SearchIcon'
import BottomSheetPage from '../BottomSheetPage'

export default function ProductFetchError({ link, onBack, onManualInput }) {
  return (
    <BottomSheetPage
      header={<Header onBack={onBack} />}
      title={
        <>
          <h1 className='text-title text-black'>페이지를 읽지 못했어요.</h1>
          <p className='text-body2 text-gray-500'>
            로그인이 필요한 페이지거나,
            <br />
            아직 지원하지 않는 쇼핑몰이에요.
          </p>
        </>
      }
    >
      <Input
        value={link}
        invalid
        icon={<SearchIcon className='shrink-0 text-gray-500' />}
        className='h-14'
      />

      <div className='mt-auto flex flex-col gap-2'>
        <Button onClick={onManualInput} variant='dark' className='text-head'>
          직접 입력할게요
        </Button>
        <Button onClick={onBack} variant='secondary' className='text-head text-gray-600'>
          다른 링크 입력
        </Button>
      </div>
    </BottomSheetPage>
  )
}
