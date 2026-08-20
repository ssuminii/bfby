import { isGoodSpending, isPendingCard, isSaving, totalSaved } from './history.js'

const byNewest = (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()

const sameMonth = (date, year, month) =>
  date.getFullYear() === year && date.getMonth() === month

export function recentSavingMonths(history, now = new Date(), count = 6) {
  const savings = history.filter(isSaving)

  return Array.from({ length: count }, (_, index) => {
    const offset = count - index - 1
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)
    const amount = savings.reduce((sum, record) => {
      const recordedAt = new Date(record.at)
      if (Number.isNaN(recordedAt.getTime())) return sum
      return sameMonth(recordedAt, date.getFullYear(), date.getMonth())
        ? sum + (record.price ?? 0)
        : sum
    }, 0)

    return {
      key: `${date.getFullYear()}-${date.getMonth() + 1}`,
      label: `${date.getMonth() + 1}월`,
      amount,
    }
  })
}

export function reportHistorySummary(history, now = new Date()) {
  const savingRecords = history.filter(isSaving)
  const months = recentSavingMonths(history, now)
  const recentTotal = months.reduce((sum, month) => sum + month.amount, 0)
  const lastThree = months.slice(-3).map((month) => month.amount)

  return {
    months,
    currentMonthSaved: months.at(-1)?.amount ?? 0,
    totalSaved: totalSaved(history),
    savingCount: savingRecords.length,
    monthlyAverage: Math.round(recentTotal / months.length),
    isIncreasing:
      lastThree.length === 3 &&
      lastThree[0] < lastThree[1] &&
      lastThree[1] < lastThree[2],
  }
}

export const spendingCollections = (history) => ({
  good: history.filter(isGoodSpending).sort(byNewest),
  saving: history.filter(isSaving).sort(byNewest),
})

// 카드 발급이 미뤄진 것들. 체크인에서 만족도를 들어야 카드가 정해진다.
export const pendingDecisions = (history) =>
  history.filter(isPendingCard).sort(byNewest)
