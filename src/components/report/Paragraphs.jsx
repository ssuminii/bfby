import Muted from "./Muted";

export default function Paragraphs({ items }) {
  return (
    <div className="w-full flex flex-col gap-4">
      {items.map((text) => (
        <Muted key={text}>{text}</Muted>
      ))}
    </div>
  );
}
