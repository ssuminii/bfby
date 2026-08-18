import { useNavigate } from 'react-router-dom'
import ChevronLeftIcon from './icons/ChevronLeftIcon'

export default function AppBar({ title, onBack }) {
  const navigate = useNavigate()

  return (
    <header className='relative h-[120px] shrink-0 bg-white'>
      <button
        type='button'
        onClick={onBack ?? (() => navigate(-1))}
        aria-label='뒤로 가기'
        className='absolute bottom-0 left-2 flex size-12 items-center justify-center bg-transparent text-black'
      >
        <ChevronLeftIcon />
      </button>
      <h1 className='absolute bottom-[10px] left-1/2 -translate-x-1/2 whitespace-nowrap text-title text-black'>
        {title}
      </h1>
    </header>
  )
}
