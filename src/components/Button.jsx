const variants = {
  default: 'bg-gray-100 text-gray-500',
  active: 'bg-blue-500 text-white',
  dark: 'bg-gray-800 text-white',
}

export default function Button({ children, onClick, variant = 'default', className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`w-[345px] h-[52px] rounded-[12px] text-body1 font-bold text-center transition-colors ${variants[variant]} ${className}`}
      style={{ letterSpacing: '-0.16px', lineHeight: 1.45 }}
    >
      {children}
    </button>
  )
}
