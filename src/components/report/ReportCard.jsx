import Card from "../Card";
import Amount from "./Amount";
import CardTitle from "./CardTitle";
import Lead from "./Lead";
import Paragraphs from "./Paragraphs";
import ReasonList from "./ReasonList";
import SoftTag from "./SoftTag";

export default function ReportCard({ card }) {
  return (
    <Card
      className="flex flex-col justify-center items-start self-stretch gap-4 px-4 py-6 bg-white"
      style={{ borderRadius: "12px" }}
    >
      <CardTitle>{card.title}</CardTitle>
      {card.items && <ReasonList items={card.items} />}
      {card.amount && <Amount value={card.amount} formula={card.formula} />}
      {card.lead && <Lead>{card.lead}</Lead>}
      {card.lines && <Paragraphs items={card.lines} />}
      {card.tag && <SoftTag>{card.tag}</SoftTag>}
      {card.footnotes && <Paragraphs items={card.footnotes} />}
    </Card>
  );
}
