export default function Tag({
  children,
  bg = 'bg-info',
  text = 'text-white',
  weight = 'font-bold',
  className = '',
}) {
  return (
    <span
      className={`inline-flex justify-center items-center gap-2.5 px-2
        rounded-full text-center text-body2 leading-[1.5] tracking-tight-1
        ${bg} ${text} ${weight} ${className}`}
    >
      {children}
    </span>
  )
}
