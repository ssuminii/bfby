import Tag from "../Tag";

export default function SoftTag({ children }) {
  return (
    <Tag bg="bg-blue-50" text="text-blue-500">
      {children}
    </Tag>
  );
}
