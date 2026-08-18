import { useState } from 'react'

export default function Input({ value, onChange, placeholder, invalid, icon, bordered = false, className = '', ...props }) {
  const [focused, setFocused] = useState(false)
  const readOnly = !onChange

  const borderClass = invalid
    ? 'border-2 border-error'
    : focused
      ? 'border-2 border-blue-500'
      : bordered
        ? 'border-2 border-gray-100'
        : ''

  return (
    <div
      className={`flex items-center shrink-0 h-12.5 rounded-2xl bg-white transition-colors
        ${icon ? 'gap-2.5 px-7.5' : 'px-4'}
        ${borderClass} ${className}`}
    >
      {icon}
      {readOnly ? (
        <p
          className='min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-bodyb text-gray-500'
          title={value}
        >
          {value}
        </p>
      ) : (
        <input
          type='text'
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`w-full bg-transparent outline-none text-bodyb
            ${value ? 'text-gray-800' : 'text-gray-500 placeholder:text-gray-500'}`}
          {...props}
        />
      )}
    </div>
  )
}
