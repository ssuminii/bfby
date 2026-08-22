import ReportCard from './ReportCard'

export default function CardList({ cards }) {
  return (
    <div className='flex w-full flex-col gap-6'>
      {cards.map((card) => (
        <ReportCard key={card.title} card={card} />
      ))}
    </div>
  )
}
