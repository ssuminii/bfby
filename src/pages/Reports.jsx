import { useMemo, useState } from 'react'
import AppBar from '../components/AppBar'
import NavBar from '../components/NavBar'
import CollectionSection from '../components/reports/CollectionSection'
import SavingsOverview from '../components/reports/SavingsOverview'
import { loadHistory } from '../utils/history'
import {
  pendingDecisions,
  reportHistorySummary,
  spendingCollections,
} from '../utils/reportHistory'

export default function Reports() {
  const [history] = useState(() => loadHistory())
  const summary = useMemo(() => reportHistorySummary(history), [history])
  const collections = useMemo(() => spendingCollections(history), [history])
  const pending = useMemo(() => pendingDecisions(history), [history])

  return (
    <div className='flex h-full flex-col bg-white'>
      <AppBar title='리포트' />
      <main className='min-h-0 flex-1 overflow-y-auto overflow-x-hidden'>
        <SavingsOverview summary={summary} />
        <div className='mx-6 border-t border-gray-100' />
        <CollectionSection collections={collections} pending={pending} />
      </main>
      <NavBar />
    </div>
  )
}
