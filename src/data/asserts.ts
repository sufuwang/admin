import { type TCurrency, type TColumnKeys, ColumnKeys } from '@/lib/const'
import { formatNumber } from '@/lib/utils'
import { getYear } from 'date-fns'

const curYear = getYear(new Date())

/**
 *收入表
 */
export type TIncomeTableRow = {
  year: 2025
  month: Month
  wageIncome?: number
  fundIncome?: number
  partTimeIncome?: number
  investmentIncome?: number
  otherIncome?: number
  totalPureIncome: number
  transferIncome?: number
  totalIncome: number
  comment?: string
}
export const IncomeTable: TIncomeTableRow[] = [
  {
    year: 2025,
    month: 'January',
    wageIncome: 8953.5,
    fundIncome: 4800,
    transferIncome: 33146.79,
  },
  {
    year: 2025,
    month: 'February',
    wageIncome: 8965.43,
    transferIncome: 8801.25,
  },
  {
    year: 2025,
    month: 'March',
    wageIncome: 7471.28,
    fundIncome: 960,
    transferIncome: 10970.05,
  },
  {
    year: 2025,
    month: 'April',
    wageIncome: 7104.89,
    fundIncome: 960,
    investmentIncome: 18433.14,
    transferIncome: 10434.97,
  },
  {
    year: 2025,
    month: 'May',
    wageIncome: 7104.9,
    fundIncome: 960,
    partTimeIncome: 2400,
    investmentIncome: -1528.46,
    otherIncome: 1800,
    transferIncome: 29278.54,
    comment: '川发押金（800）、闲亭赔偿（1000）'
  },
  {
    year: 2025,
    month: 'June',
    wageIncome: 7098.92,
    fundIncome: 960,
    partTimeIncome: 1000,
    investmentIncome: 581.31,
    transferIncome: 22502.04,
  },
  {
    year: 2025,
    month: 'July',
    wageIncome: 7104.89,
    fundIncome: 960,
    investmentIncome: 512.31,
    otherIncome: 1000,
    transferIncome: 14694.88,
  },
  {
    year: 2025,
    month: 'August',
    wageIncome: 6482.47,
    fundIncome: 960,
    transferIncome: 13857.81,
  },
  {
    year: 2025,
    month: 'September',
    wageIncome: 8987.84,
    fundIncome: 960,
    transferIncome: 7120,
  },
].map(row => {
  const totalPureIncome = row.wageIncome + (row.fundIncome ?? 0) + (row.partTimeIncome ?? 0) + (row.investmentIncome ?? 0) + (row.otherIncome ?? 0)
  const totalIncome = totalPureIncome + row.transferIncome
  const defaultValue = {
    year: 0,
    month: '',
    wageIncome: 0,
    fundIncome: 0,
    partTimeIncome: 0,
    investmentIncome: 0,
    otherIncome: 0,
    totalPureIncome,
    transferIncome: 0,
    totalIncome,
    comment: '',
  }
  return Object.assign(defaultValue, row) as TIncomeTableRow
})
export type TIncomeTableSum = Record<Exclude<keyof TIncomeTableRow, 'year' | 'month' | 'totalIncome' | 'comment' | 'totalPureIncome'>, number>
export const IncomeTableSum: TIncomeTableSum = {
  wageIncome: IncomeTable.reduce((a, b) => a + (b.wageIncome ?? 0), 0),
  fundIncome: IncomeTable.reduce((a, b) => a + (b.fundIncome ?? 0), 0),
  partTimeIncome: IncomeTable.reduce((a, b) => a + (b.partTimeIncome ?? 0), 0),
  investmentIncome: IncomeTable.reduce((a, b) => a + (b.investmentIncome ?? 0), 0),
  otherIncome: IncomeTable.reduce((a, b) => a + (b.otherIncome ?? 0), 0),
  transferIncome: IncomeTable.reduce((a, b) => a + (b.transferIncome ?? 0), 0),
}

/**
 * 支出表
 */
export type TOutcomeTableRow = {
  year: 2025
  month: Month
  totalOutcome: number
  loans?: { value: number; header: string }[]
  houseOutcome?: number
  foodOutcome?: number
  transportOutcome?: number
  relativeOutcome?: number
  specialOutcome?: number
  bulkOutcome?: number
  otherOutcome?: number
  comment?: string
}
export const OutcomeTable: TOutcomeTableRow[] = [
  {
    year: 2025,
    month: 'January',
    loans: [{ value: 7170.44, header: '房贷还款' }],
    houseOutcome: 2048,
    foodOutcome: 0,
    transportOutcome: 0,
    relativeOutcome: 1646.28,
    specialOutcome: 0,
    bulkOutcome: 0,
    otherOutcome: 2859.69,
    totalOutcome: 0,
  },
  {
    year: 2025,
    month: 'February',
    loans: [{ value: 6141.63, header: '房贷还款' }],
    houseOutcome: 87.6,
    relativeOutcome: 477.07,
    otherOutcome: 11060.38,
    comment: '数据错误'
  },
  {
    year: 2025,
    month: 'March',
    loans: [{ value: 11117.57, header: '房贷还款' }],
    houseOutcome: 960,
    relativeOutcome: 5512.9,
    otherOutcome: 3958.6,
    comment: '杭州旅行（5000）'
  },
  {
    year: 2025,
    month: 'April',
    loans: [{ value: 17069.37, header: '房贷还款' }],
    houseOutcome: 5500,
    relativeOutcome: 599.9,
    specialOutcome: 230,
    otherOutcome: 1239.58,
    comment: '搬家至桐堂（5500）'
  },
  {
    year: 2025,
    month: 'May',
    loans: [{ value: 1992.08, header: '房贷还款' }],
    houseOutcome: 560,
    relativeOutcome: 599.14,
    bulkOutcome: 4698,
    otherOutcome: 156.4,
    comment: '电视（1717）、iPhone 14（2981）'
  },
  {
    year: 2025,
    month: 'June',
    loans: [{ value: 17987.24, header: '房贷还款' }],
    houseOutcome: 534.01,
    foodOutcome: 1403.5,
    relativeOutcome: 1268.48,
    otherOutcome: 1927.18,
  },
  {
    year: 2025,
    month: 'July',
    loans: [{ value: 36904.76, header: '房贷还款' }],
    houseOutcome: 3846.36,
    foodOutcome: 1874.2,
    relativeOutcome: 1397.28,
    specialOutcome: 1120,
    bulkOutcome: 6600,
    otherOutcome: 528.65,
    comment: '桐堂租金（3846.36）、吴刚吃饭（993）、香港金项链（6600）'
  },
  {
    year: 2025,
    month: 'August',
    loans: [{ value: 12729.74, header: '房贷还款' }],
    houseOutcome: 101,
    foodOutcome: 1381.4,
    relativeOutcome: 993.15,
    transportOutcome: 244.96,
    otherOutcome: 2462.61
  },
  {
    year: 2025,
    month: 'September',
    loans: [{ value: 21671.27, header: '房贷还款' }],
    houseOutcome: 9780.37,
    foodOutcome: 1671.4,
    relativeOutcome: 643.94,
    transportOutcome: 118.75,
    specialOutcome: 6000,
    bulkOutcome: 0,
    otherOutcome: -2811.11,
    comment: '西安小区物业费（5500）、曾（6000)、桐堂租金（4280.37）'
  },
].map(row => {
  const outcomeSum = Object.entries(row)
    .filter(([key]) => key.endsWith('Outcome'))
    .reduce((sum, [, value]) => sum + (Number(value) || 0), 0)
  const loanSum = row.loans?.reduce((sum, l) => sum + l.value, 0) ?? 0
  const defaultValue = {
    year: 2025,
    month: '',
    totalOutcome: outcomeSum + loanSum,
    loans: [],
    houseOutcome: 0,
    foodOutcome: 0,
    transportOutcome: 0,
    relativeOutcome: 0,
    specialOutcome: 0,
    bulkOutcome: 0,
    otherOutcome: 0,
    comment: ''
  }
  return Object.assign(defaultValue, row) as TOutcomeTableRow
})
export type TOutcomeTableSum = Record<Exclude<keyof TOutcomeTableRow, 'year' | 'month' | 'totalOutcome' | 'comment'>, number>
export const OutcomeTableSum: TOutcomeTableSum = {
  loans: OutcomeTable.reduce((a, b) => a + (b.loans?.reduce((c, d) => c + d.value, 0) ?? 0), 0),
  houseOutcome: OutcomeTable.reduce((a, b) => a + (b.houseOutcome ?? 0), 0),
  foodOutcome: OutcomeTable.reduce((a, b) => a + (b.foodOutcome ?? 0), 0),
  transportOutcome: OutcomeTable.reduce((a, b) => a + (b.transportOutcome ?? 0), 0),
  relativeOutcome: OutcomeTable.reduce((a, b) => a + (b.relativeOutcome ?? 0), 0),
  specialOutcome: OutcomeTable.reduce((a, b) => a + (b.specialOutcome ?? 0), 0),
  bulkOutcome: OutcomeTable.reduce((a, b) => a + (b.bulkOutcome ?? 0), 0),
  otherOutcome: OutcomeTable.reduce((a, b) => a + (b.otherOutcome ?? 0), 0),
}

/**
 * 资产负债表
 */
export type TBalanceTableRow = {
  year: 2025
  month: Month
  totalIncome: number
  totalOutcome: number
  balances?: {
    abbr: TCurrency['abbr']
    value: number
    MoM?: number
    YoY?: number
  }[]
  loans?: { value: number; header: string }[]
  comment?: string
}
export const BalanceTable: TBalanceTableRow[] = [
  {
    year: 2025,
    month: 'January',
    totalIncome: 0,
    totalOutcome: 0,
    balances: [
      { abbr: 'CNY', value: 201332.35, MoM: 33175.88 },
    ],
    loans: [],
  },
  {
    year: 2025,
    month: 'February',
    balances: [{ abbr: 'HKD', value: 33651.32 }],
    loans: [],
    comment: '数据错误'
  },
  {
    year: 2025,
    month: 'March',
    balances: [
      { abbr: 'CNY', value: 225034.79, MoM: -2147.74 },
      { abbr: 'HKD', value: 33657.77 }
    ],
  },
  {
    year: 2025,
    month: 'April',
    balances: [
      { abbr: 'CNY', value: 237328.94, MoM: 12294.15 },
      { abbr: 'HKD', value: 12343.3 }
    ],
  },
  {
    year: 2025,
    month: 'May',
    balances: [
      { abbr: 'CNY', value: 269338.3, MoM: 32009.36 },
      { abbr: 'HKD', value: 12210.33 }
    ],
  },
  {
    year: 2025,
    month: 'June',
    balances: [
      { abbr: 'CNY', value: 278460.12, MoM: 9121.86 },
      { abbr: 'HKD', value: 11790.33 }
    ],
  },
  {
    year: 2025,
    month: 'July',
    balances: [
      { abbr: 'CNY', value: 250460.95, MoM: -27999.17 },
      { abbr: 'HKD', value: 12994.49 }
    ],
  },
  {
    year: 2025,
    month: 'August',
    balances: [
      { abbr: 'CNY', value: 254093.33, MoM: 3632.38 },
      { abbr: 'HKD', value: 13136.71 }
    ],
    loans: [{ value: 149893.33, header: '剩余房贷' }],
  },
  {
    year: 2025,
    month: 'September',
    balances: [
      { abbr: 'CNY', value: 234205.3, MoM: -19888.03 },
      { abbr: 'HKD', value: 14505.93 }
    ],
    loans: [{ value: 137591.18, header: '剩余房贷' }],
  },
].map(row => {
  row.totalIncome = IncomeTable.find(r => r.year === row.year && r.month === row.month)?.totalIncome
  row.totalOutcome = OutcomeTable.find(r => r.year === row.year && r.month === row.month)?.totalOutcome
  return row as TBalanceTableRow
})
export type TBalanceTableSum = Record<'totalIncome' | 'totalOutcome', number>
export const BalanceTableSum: TBalanceTableSum = {
  totalIncome: BalanceTable.reduce((a, b) => a + (b.totalIncome ?? 0), 0),
  totalOutcome: BalanceTable.reduce((a, b) => a + (b.totalOutcome ?? 0), 0),
}

// 卡片列表
export const NumberCardListData = (() => {
  const rows = []
  const lastCNYRow = BalanceTable.findLast((row) => row.balances?.length)!.balances?.find((b) => b.abbr === 'CNY')
  if (lastCNYRow) {
    rows.push({
      title: '人民币余额',
      value: formatNumber(lastCNYRow.value || 0),
      description: `较上月增长 ${formatNumber(lastCNYRow.MoM || 0)}<br />较去年同期增长 ${formatNumber(lastCNYRow.YoY || 0)}`,
    })
  }
  const lastHKDRow = BalanceTable.findLast((row) => row.balances?.length)!.balances?.find((b) => b.abbr === 'HKD')
  if (lastHKDRow) {
    rows.push({
      title: '港币余额',
      value: formatNumber(lastHKDRow.value, 'HKD'),
      description: `较上月增长 ${formatNumber(lastHKDRow.MoM || 0)}<br />较去年同期增长 ${formatNumber(lastHKDRow.YoY || 0)}`,
    })
  }
  const curYearRows = BalanceTable.filter(row => row.year === curYear)
  const totalIncome = +curYearRows.reduce((a, b) => a + b.totalIncome, 0)
  const totalOutcome = +curYearRows.reduce((a, b) => a + b.totalOutcome, 0)
  rows.push(...[
    {
      title: '总收入',
      value: formatNumber(totalIncome),
      description: '年初至今累计收入',
    },
    {
      title: '总支出',
      value: formatNumber(totalOutcome),
      description: '年初至今累计支出',
    }
  ])
  const _IncomeTableSum = Object.entries(IncomeTableSum)
  const maxIncome = _IncomeTableSum.filter(row => row[0] !== 'investmentIncome').reduce((prev, cur) => cur[1] > prev[1] ? cur : prev, _IncomeTableSum[0])
  rows.push({
    title: '最大收入占比',
    value: formatNumber(maxIncome[1] / totalIncome, '%'),
    description: `${ColumnKeys[maxIncome[0] as TColumnKeys]}为今年收入的主要来源（除投资收入）`,
  })
  // const [, wageIncome] = _IncomeTableSum.find(row => row[0] === 'wageIncome') ?? ['', 0]
  // rows.push({
  //   title: '工资收入占比',
  //   value: formatNumber(wageIncome / totalIncome, '%'),
  //   description: '工资收入占今年收入的比率',
  // })
  const [, investmentIncome] = _IncomeTableSum.find(row => row[0] === 'investmentIncome') ?? ['', 0]
  rows.push({
    title: '投资收入占比',
    value: formatNumber(investmentIncome / totalIncome, '%'),
    description: '投资收入占今年收入的比率',
  })
  const _OutcomeTableSum = Object.entries(OutcomeTableSum)
  const maxOutcome = _OutcomeTableSum.filter(row => row[0] !== 'loans').reduce((prev, cur) => cur[1] > prev[1] ? cur : prev, ['', 0])
  rows.push({
    title: '最大支出占比',
    value: formatNumber(maxOutcome[1] / totalOutcome, '%'),
    description: `${ColumnKeys[maxOutcome[0] as TColumnKeys]}为今年支出的主要来源（除房贷还款支出）`,
  })
  const [, loansOutcome] = _OutcomeTableSum.find(row => row[0] === 'loans') ?? ['', 0]
  rows.push({
    title: '房贷还款支出占比',
    value: formatNumber(loansOutcome / totalOutcome, '%'),
    description: `房贷还款占今年支出的比率`,
  })
  return rows
})()