import { Link } from 'react-router-dom'
import Card from '../Card'

export default function SavingsCard({ amount = 1245000, cardCount = 12, monthlyAmount = 85000 }) {
  return (
    <Link to='/reports'>
      <Card className='w-full bg-white p-6'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-4'>
            <p className='text-head text-gray-600'>지금까지 참아서 아낀 돈</p>
            <p className='text-display text-gray-800'>{amount.toLocaleString()}원</p>
          </div>
          <div className='flex gap-3 items-center flex-wrap'>
            <span className='border-2 border-gray-100 rounded-full px-3 py-[2px] text-caption text-gray-600'>
              좋은 소비결정 카드 {cardCount}장
            </span>
            <span className='bg-blue-500 border-2 border-white rounded-full px-3 py-[2px] text-caption text-white'>
              이번 달 + {monthlyAmount.toLocaleString()}원
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
