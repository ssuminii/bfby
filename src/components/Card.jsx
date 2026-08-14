export default function Card({ children, gap = 'gap-4', className = '' }) {
  return (
    <div
      className={`w-full flex flex-col justify-center items-start px-4 py-6
        rounded-[12px] bg-white shadow-[0_0_6px_0_rgba(0,0,0,0.08)] ${gap} ${className}`}
    >
      {children}
    </div>
  )
}
