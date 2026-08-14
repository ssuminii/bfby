import ReportCard from "./ReportCard";

export default function CardList({ cards }) {
  return (
    <div className="w-full flex flex-col gap-6">
      {cards.map((card) => (
        <ReportCard key={card.title} card={card} />
      ))}
    </div>
  );
}
