import Logo from '../components/Logo'
import NavBar from '../components/NavBar'
import ConsultCard from '../components/home/ConsultCard'
import SavingsCard from '../components/home/SavingsCard'

export default function Home() {
  return (
    <div
      className='flex flex-col h-full'
      style={{ background: 'linear-gradient(to bottom, #ffffff 10%, #e9f2ff 50%, #ffffff 100%)' }}
    >
      <Logo />

      <div className='flex-1 overflow-y-auto px-6 pb-4'>
        <div className='flex flex-col gap-2 mt-[22px] mb-6'>
          <p className='text-title font-bold text-gray-800'>
            좋은 하루예요!
            <br />
            상품의 구매를 고민하고 계신가요?
          </p>
          <p className='text-body2 text-gray-600'>링크만 있으면 30초면 끝나요.</p>
        </div>

        <div className='flex flex-col gap-9'>
          <ConsultCard />
          <SavingsCard />
        </div>
      </div>

      <NavBar />
    </div>
  )
}
