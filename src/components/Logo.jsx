import { Link } from 'react-router-dom'

export default function Logo({ clickable = false }) {
  const logo = (
    <span
      className='text-blue-500'
      style={{
        fontFamily: "'Racing Sans One', cursive",
        fontSize: '24px',
        lineHeight: 'normal',
      }}
    >
      Before Buy
    </span>
  )

  if (clickable) {
    return (
      <Link to='/home' className='flex h-16 shrink-0 cursor-pointer items-center px-6'>
        {logo}
      </Link>
    )
  }

  return <div className='flex h-16 shrink-0 items-center px-6'>{logo}</div>
}
