export default function AiIcon({ className = '' }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 3L13.5 9L19.5 10.5L13.5 12L12 18L10.5 12L4.5 10.5L10.5 9L12 3Z"
        fill="#2F80FF"
      />
      <circle cx="18" cy="6" r="1.5" fill="#2F80FF" opacity="0.6" />
      <circle cx="6" cy="18" r="1" fill="#2F80FF" opacity="0.4" />
    </svg>
  )
}
