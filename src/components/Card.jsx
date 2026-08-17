export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-[24px] drop-shadow-[0px_0px_3px_rgba(0,0,0,0.12)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
