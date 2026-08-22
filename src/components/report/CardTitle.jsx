import CardIcon from "./CardIcon";

export default function CardTitle({ icon, children }) {
  return (
    <div className="flex items-center gap-2">
      <CardIcon name={icon} />
      <p className="text-head text-gray-800">{children}</p>
    </div>
  );
}
