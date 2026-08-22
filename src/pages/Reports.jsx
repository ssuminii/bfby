import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import NavBar from '../components/NavBar'
import CollectionSection from '../components/reports/CollectionSection'
import SavingsOverview from '../components/reports/SavingsOverview'
import { MOCK_HISTORY } from '../mocks/history'
import { loadHistory, mergeHistory } from '../utils/history'
import {
  pendingDecisions,
  regretDecisions,
  reportHistorySummary,
  spendingCollections,
} from '../utils/reportHistory'

export default function Reports() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const justAdded = state?.justAdded
  const [history, setHistory] = useState(() => mergeHistory(MOCK_HISTORY, loadHistory()))
  const summary = useMemo(() => reportHistorySummary(history), [history])
  const collections = useMemo(() => spendingCollections(history), [history])
  const regrets = useMemo(() => regretDecisions(history), [history])
  const pending = useMemo(() => pendingDecisions(history), [history])

  // 남겨두면 다음 습득 때 view-transition-name이 둘이 되어 전환이 취소된다
  useEffect(() => {
    if (!justAdded) return undefined
    const timer = setTimeout(() => navigate('.', { replace: true, state: null }), 1200)
    return () => clearTimeout(timer)
  }, [justAdded, navigate])

  const handleResolveRecord = (record) => {
    setHistory((current) => current.map((item) => (item.at === record.at ? record : item)))
  }

  return (
    <div className='flex h-full flex-col bg-white'>
      <Header title='리포트' />
      <main className='min-h-0 flex-1 overflow-y-auto overflow-x-hidden'>
        <SavingsOverview summary={summary} />
        <div className='mx-6 border-t border-gray-100' />
        <CollectionSection
          collections={collections}
          regrets={regrets}
          pending={pending}
          justAdded={justAdded}
          onResolveRecord={handleResolveRecord}
        />
      </main>
      <NavBar />
    </div>
  )
}
