import { Link } from 'react-router-dom'
import bulbImg from '../../assets/bulb.png'
import Card from '../Card'

export default function ConsultCard() {
  return (
    <Link to="/consult/setup">
      <Card
        className="w-full py-8 px-[10px] flex flex-col items-center gap-[10px] drop-shadow-[0px_0px_6px_rgba(0,0,0,0.12)]"
        style={{
          background: 'radial-gradient(99.85% 99.85% at 50% 0%, #2F80FF 71.63%, #8DB9FF 100%)',
        }}
      >
        <img src={bulbImg} alt="" className="w-[72px] h-[72px] object-cover" />
        <p className="text-head text-white text-center">
          고민되는 상품 구매 조언받기
        </p>
      </Card>
    </Link>
  )
}
