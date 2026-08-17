import { NavLink } from 'react-router-dom'
import HomeIcon from '../assets/icons/home.svg?react'
import HomeActiveIcon from '../assets/icons/home_active.svg?react'
import ReportIcon from '../assets/icons/report.svg?react'
import ReportActiveIcon from '../assets/icons/report_active.svg?react'
import CartIcon from '../assets/icons/cart.svg?react'
import CartActiveIcon from '../assets/icons/cart_active.svg?react'

const TABS = [
  { to: '/home', label: '홈', Icon: HomeIcon, ActiveIcon: HomeActiveIcon },
  { to: '/reports', label: '리포트', Icon: ReportIcon, ActiveIcon: ReportActiveIcon },
  { to: '/buyornot', label: '살래말래', Icon: CartIcon, ActiveIcon: CartActiveIcon },
]

export default function NavBar() {
  return (
    <div className="flex items-start justify-center gap-4 px-6 bg-white drop-shadow-[0px_0px_6px_rgba(0,0,0,0.12)] shrink-0">
      {TABS.map(({ to, label, Icon, ActiveIcon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className="flex flex-col items-center gap-[6px] pt-3 pb-5 w-[74px]"
        >
          {({ isActive }) => (
            <>
              <div className="flex items-center justify-center h-6">
                {isActive ? <ActiveIcon /> : <Icon />}
              </div>
              <span
                className={`font-semibold text-bodyb tracking-[-0.14px] leading-[1.5] ${isActive ? 'text-gray-800' : 'text-gray-600'}`}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}
