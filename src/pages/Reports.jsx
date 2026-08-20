import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import NavBar from '../components/NavBar'
import CollectionSection from '../components/reports/CollectionSection'
import SavingsOverview from '../components/reports/SavingsOverview'
import { MOCK_HISTORY } from '../mocks/history'
import { loadHistory } from '../utils/history'
import {
  pendingDecisions,
  regretDecisions,
  reportHistorySummary,
  spendingCollections,
} from '../utils/reportHistory'

export default function Reports() {
  const { state } = useLocation()
  const [history, setHistory] = useState(() => [...MOCK_HISTORY, ...loadHistory()])
  const summary = useMemo(() => reportHistorySummary(history), [history])
  const collections = useMemo(() => spendingCollections(history), [history])
  const regrets = useMemo(() => regretDecisions(history), [history])
  const pending = useMemo(() => pendingDecisions(history), [history])

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
          justAdded={state?.justAdded}
          onResolveRecord={handleResolveRecord}
        />
      </main>
      <NavBar />
    </div>
  )
}
