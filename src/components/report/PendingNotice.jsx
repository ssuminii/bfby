import { useNavigate } from 'react-router-dom'
import Button from '../Button'

/**
 * 카드 발급이 아직 정해지지 않은 결정을 알리는 화면.
 *
 * 더 고민할게요(살래말래 보관)와 말렸는데도 샀어요(체크인 대기)가 이 화면을 함께 쓴다.
 * 두 경우 모두 카드가 확정되기 전이라 카드를 얻었다는 식으로 말하지 않고,
 * 카드 자리는 물음표로 비워 둔다.
 */
export default function PendingNotice({ title, caption, to }) {
  const navigate = useNavigate()

  return (
    <div className='relative h-full overflow-hidden bg-white'>
      {/* left-1/2로 두면 절대 배치 요소가 화면 절반 폭 안에서만 줄바꿈을 계산해
          문구가 접힌다. 전체 폭을 주고 가운데 정렬한다 */}
      <div className='absolute inset-x-0 top-[206px] flex flex-col items-center gap-10'>
        <p className='whitespace-pre-line text-center text-title text-black'>{title}</p>

        <div className='flex flex-col items-center gap-10'>
          <div className='flex h-[152px] w-[104px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-report-pending-gradient'>
            <span className='text-display text-gray-200'>?</span>
          </div>
          <p className='whitespace-pre-line text-center text-body1 text-gray-600'>{caption}</p>
        </div>
      </div>

      <div className='absolute bottom-10 left-1/2 w-[345px] -translate-x-1/2'>
        {/* 이미 결정을 내린 참이라 다시 묻지 않고 닫기만 둔다 */}
        <Button variant='dark' onClick={() => navigate(to)}>
          닫기
        </Button>
      </div>
    </div>
  )
}
