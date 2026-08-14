export default function ReasonOption({ label, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center justify-between h-[50px] shrink-0 px-4 rounded-2xl
        border-2 transition-colors text-left
        ${selected ? "bg-blue-50 border-blue-300" : "bg-gray-50 border-transparent"}`}
    >
      <span
        className={`text-bodyb font-medium tracking-tight-1
          ${selected ? "text-gray-800" : "text-gray-700"}`}
      >
        {label}
      </span>
      <span
        className={`w-5 h-5 shrink-0 rounded-full bg-white border-[6px] transition-colors
          ${selected ? "border-blue-500" : "border-gray-300"}`}
      />
    </button>
  );
}
