import type { TCurrency } from '@/lib/const'

export const data = new Array(10).fill(0).map((_, key) => ({
  title: 'Total Revenue ' + key,
  value: '$45,231.89',
  description: '+20.1% from last month',
  icon: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      className='text-muted-foreground h-4 w-4'
    >
      <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
    </svg>
  ),
}))

/**
 * 资产负债表
 */
export type TBalanceTableRow = {
  year: 2025,
  month: Month
  totalIncome: number
  totalOutcome: number
  balances: { abbr: TCurrency['abbr'], value: number, MoM: number | '-', YoY: number | '-' }[]
  loans?: { value: number, header: string }[]
  comment: string
}
export const BalanceTable: TBalanceTableRow[] = [
  { year: 2025, month: 'January', totalIncome: 10000, totalOutcome: 5000, balances: [{ abbr: 'CNY', value: 5000, MoM: '-', YoY: '-' }, { abbr: 'USD', value: 5000, MoM: '-', YoY: '-' }], loans: [{ value: 20000, header: '剩余房贷' }], comment: 'Good month' },
  { year: 2025, month: 'February', totalIncome: 12000, totalOutcome: 6000, balances: [{ abbr: 'USD', value: 6000, MoM: 20, YoY: '-' }], loans: [{ value: 18000, header: '剩余房贷' }], comment: 'Better month' },
  { year: 2025, month: 'March', totalIncome: 15000, totalOutcome: 7000, balances: [{ abbr: 'USD', value: 8000, MoM: 30, YoY: '-' }], loans: [{ value: 16000, header: '剩余房贷' }], comment: 'Great month' },  
]

/**
 *收入表
 */
export type TIncomeTableRow = {
  year: 2025,
  month: Month
  wageIncome: number
  fundIncome: number
  partTimeIncome: number
  investmentIncome: number
  otherIncome: number
  pureTotalIncome: number
  transferIncome: number
  totalIncome: number
  comment: string
}
export const IncomeTable: TIncomeTableRow[] = [
  { year: 2025, month: 'January', wageIncome: 5000, fundIncome: 2, partTimeIncome: 2000, investmentIncome: 1000, otherIncome: 2000, pureTotalIncome: 10000, transferIncome: 0, totalIncome: 10000, comment: 'Good month' },
  { year: 2025, month: 'February', wageIncome: 6000, fundIncome: 2, partTimeIncome: 3000, investmentIncome: 1000, otherIncome: 2000, pureTotalIncome: 12000, transferIncome: 0, totalIncome: 12000, comment: 'Better month' },
  { year: 2025, month: 'March', wageIncome: 7000, fundIncome: 2, partTimeIncome: 4000, investmentIncome: 1000, otherIncome: 3000, pureTotalIncome: 15000, transferIncome: 0, totalIncome: 15000, comment: 'Great month' },  
]

/**
 * 支出表
 */
export type TOutcomeTableRow = {
  year: 2025,
  month: Month
  totalOutcome: number
  loans?: { value: number, header: string }[]
  houseOutcome: number
  foodOutcome: number
  transportOutcome: number
  relativeOutcome: number
  specialOutcome: number
  bulkOutcome: number
  comment: string
}
export const OutcomeTable: TOutcomeTableRow[] = [
  { year: 2025, month: 'January', totalOutcome: 5000, loans: [{ value: 1000, header: '房贷还款' }], houseOutcome: 1000, foodOutcome: 1000, transportOutcome: 500, relativeOutcome: 500, specialOutcome: 1000, bulkOutcome: 1000, comment: 'Good month' },
  { year: 2025, month: 'February', totalOutcome: 6000, loans: [{ value: 1000, header: '房贷还款' }], houseOutcome: 1200, foodOutcome: 1200, transportOutcome: 600, relativeOutcome: 600, specialOutcome: 1200, bulkOutcome: 1200, comment: 'Better month' },
  { year: 2025, month: 'March', totalOutcome: 7000, loans: [{ value: 1000, header: '房贷还款' }], houseOutcome: 1500, foodOutcome: 1500, transportOutcome: 700, relativeOutcome: 700, specialOutcome: 1500, bulkOutcome: 1500, comment: 'Great month' },  
]