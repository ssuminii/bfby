import Amount from './Amount'
import CardTitle from './CardTitle'
import Lead from './Lead'
import Paragraphs from './Paragraphs'
import ReasonList from './ReasonList'
import SoftTag from './SoftTag'

// 카드 성격에 맞는 아이콘. 제목으로 고른다.
const ICON_BY_TITLE = [
  [/이유|근거/, 'reason'],
  [/비용/, 'cost'],
  [/내 기록/, 'history'],
  [/선택지/, 'idea'],
]

const iconOf = (title = '') =>
  ICON_BY_TITLE.find(([pattern]) => pattern.test(title))?.[1] ?? 'reason'

export default function ReportCard({ card }) {
  // 신호 목록은 줄 간격이 촘촘하고, 나머지는 문단이라 더 벌린다
  const gap = card.items ? 'gap-4' : 'gap-6'

  return (
    <section
      className={`flex w-full flex-col items-start justify-center rounded-3xl bg-white p-6 drop-shadow-[0_0_3px_rgba(0,0,0,0.12)] ${gap}`}
    >
      <CardTitle icon={iconOf(card.title)}>{card.title}</CardTitle>

      {card.items && <ReasonList items={card.items} />}

      {card.amount && (
        <div className='flex w-full flex-col gap-4 px-2'>
          <Amount value={card.amount} formula={card.formula} />
          {card.footnotes && <Paragraphs items={card.footnotes} />}
        </div>
      )}

      {card.lead && <Lead>{card.lead}</Lead>}
      {card.lines && <Paragraphs items={card.lines} />}
      {!card.amount && card.footnotes && <Paragraphs items={card.footnotes} />}
      {card.tag && <SoftTag>{card.tag}</SoftTag>}
    </section>
  )
}
