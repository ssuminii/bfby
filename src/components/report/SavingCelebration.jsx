import { useNavigate } from 'react-router-dom'
import Button from '../Button'
import Confetti from '../Confetti'

/**
 * 보류·비추천 조언을 받고 안 사기로 한 뒤 보여주는 화면.
 * 참아낸 것을 축하하는 자리라 카드나 금액 대신 컨페티만 띄운다.
 */
export default function SavingCelebration() {
  const navigate = useNavigate()

  return (
    <div className='relative h-full overflow-hidden bg-white'>
      <Confetti />

      <p className='absolute inset-x-0 top-[calc(50%-30px)] whitespace-pre-line text-center text-title text-black'>
        {'고민하던 상품을\n안 사기로 했어요.'}
      </p>

      <div className='absolute bottom-10 left-1/2 w-[345px] -translate-x-1/2'>
        <Button variant='dark' onClick={() => navigate('/reports')}>
          닫기
        </Button>
      </div>
    </div>
  )
}
