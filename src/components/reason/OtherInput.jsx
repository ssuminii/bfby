export default function OtherInput({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="직접 입력할게요 (기타)"
      className="h-14 shrink-0 px-6 rounded-2xl outline-none transition-colors
        bg-gray-100 border-2 border-transparent 
        focus:bg-white focus:border-blue-500
        text-bodyb font-medium text-gray-800 placeholder:text-gray-600 tracking-tight-1"
    />
  );
}
