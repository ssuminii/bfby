export default function SearchIcon({ className = '' }) {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      className={className}
      aria-hidden='true'
    >
      <circle cx='9' cy='9' r='6.25' stroke='currentColor' strokeWidth='1.5' />
      <path
        d='M13.5 13.5L17 17'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  )
}
