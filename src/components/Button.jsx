const styles = {
  default: {
    colors: 'bg-gray-100 text-gray-500',
    size: 'w-[345px] h-[52px] rounded-[12px] text-body1 font-bold flex items-center justify-center',
    spacing: '-0.16px',
  },
  active: {
    colors: 'bg-blue-500 text-white',
    size: 'w-[345px] h-[52px] rounded-[12px] text-body1 font-bold flex items-center justify-center',
    spacing: '-0.16px',
  },
  dark: {
    colors: 'bg-gray-800 text-white',
    size: 'w-[345px] h-[52px] rounded-[12px] text-body1 font-bold flex items-center justify-center',
    spacing: '-0.16px',
  },
  chip: {
    colors: 'bg-gray-100 text-gray-500',
    size: 'rounded-[8px] text-[14px] font-semibold flex items-center justify-center',
    spacing: '-0.14px',
  },
  'chip-active': {
    colors: 'bg-blue-50 text-blue-500',
    size: 'rounded-[8px] text-[14px] font-semibold flex items-center justify-center',
    spacing: '-0.14px',
  },
}

export default function Button({ children, onClick, variant = 'default', className = '' }) {
  const { colors, size, spacing } = styles[variant]
  const disabled = variant === 'default'
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`transition-colors ${size} ${colors} ${className}`}
      style={{
        letterSpacing: spacing,
        lineHeight: 1.5,
        border: variant === 'chip-active' ? '2px solid #2f80ff' : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  )
}
