import { differenceInDays } from 'date-fns'

export type TShareMarket = 'A' | 'HK' | 'US'
export enum TShareRowStatus {
  PROFIT = 'PROFIT',
  LOSS = 'LOSS',
  BUYING = 'BUYING',
}

export type TShareRow = Readonly<{
  code: string
  share: string
  date: [string, string] | string
  days: number
  amount: number
  costPrice: number
  serviceFee: number
  sellPrice: number
  earning: number
  earningRate: number
  status: TShareRowStatus | '-'
}>

export type TShareRowKeys = AllKeys<TShareRow>

export interface TShareSum {
  cost: number
  earning: number
  serviceFee: number
  earningRate: number
}

const handleData = (shares: TShareRow[]): TShareRow[] => {
  return shares.map((row) => {
    const newRow = { ...row }
    if (Array.isArray(row.date)) {
      newRow.days = differenceInDays(row.date[1].replaceAll('.', '-'), row.date[0].replaceAll('.', '-'))
    }
    // 买入
    if (row.status === TShareRowStatus.BUYING) {
      return newRow as TShareRow
    }
    // 配股
    if (row.status === '-') {
      return newRow as TShareRow
    }
    // T
    if (Array.isArray(row.date)) {
      const earning = row.amount * (row.sellPrice - row.costPrice) - row.serviceFee
      return {
        ...newRow,
        date: [row.date[0], row.date[1]] as [string, string],
        earning,
        earningRate: +(100 * earning / (row.amount * row.costPrice)).toFixed(2),
        status: earning === 0 ? '-' : earning > 0 ? TShareRowStatus.PROFIT : TShareRowStatus.LOSS,
      } as TShareRow
    }
    // 卖出
    const buyRows = shares.filter(share => share.code === row.code && !share.serviceFee)
    const amount = buyRows.reduce((acc, buyRow) => acc + buyRow.amount, 0)
    const costPrice = buyRows.reduce((acc, row) => acc + row.costPrice, 0) / buyRows.length
    const earning = amount * (row.sellPrice - costPrice) - row.serviceFee
    return {
      ...newRow,
      amount,
      date: [row.date, buyRows[0].date] as [string, string],
      days: differenceInDays(row.date.replaceAll('.', '-'), (buyRows[0].date as string).replaceAll('.', '-')),
      costPrice,
      earning,
      earningRate: +(100 * earning / (amount * costPrice)).toFixed(2),
      status: earning === 0 ? '-' : earning > 0 ? TShareRowStatus.PROFIT : TShareRowStatus.LOSS,
    } as TShareRow
  })
}
const handleSum = (shares: TShareRow[]) => {
  const sum = { cost: 0, serviceFee: 0, earning: 0, earningRate: 0 }
  shares.reduce((acc, row) => {
    if (!row.status || [TShareRowStatus.BUYING, '-'].includes(row.status)) {
      return acc
    }
    acc.earning += row.earning as number
    acc.cost += row.amount * row.costPrice
    acc.serviceFee += row.serviceFee
    return acc
  }, sum)
  sum.earningRate = +(100 * sum.earning / sum.cost).toFixed(2)
  return sum
}

export const HKShares = handleData([
  {
    code: '00700',
    share: '腾讯',
    date: ['2021.7.1', '2025.2.17'],
    days: 0,
    amount: 67,
    costPrice: 500,
    sellPrice: 500,
    serviceFee: 0,
    status: '-',
  },
  {
    code: '03690',
    share: '美团',
    date: ['2021.7.1', '2025.2.17'],
    amount: 1,
    costPrice: 197.8,
    sellPrice: 197.8,
    serviceFee: 0,
    status: '-',
  },
  {
    code: '02589',
    share: '沪上阿姨',
    date: ['2025.5.6', '2025.5.12'],
    amount: 30,
    costPrice: 181,
    sellPrice: 126.3,
    serviceFee: 50.79,
  },
  {
    code: '03750',
    share: '宁德时代',
    date: ['2025.5.20', '2025.5.20'],
    amount: 10,
    costPrice: 295,
    sellPrice: 299,
    serviceFee: 46.5,
  },
  {
    code: '01276',
    share: '恒瑞医药',
    date: ['2025.5.23', '2025.7.9'],
    amount: 100,
    costPrice: 59,
    sellPrice: 66,
    serviceFee: 54,
  },
  {
    code: '01276',
    share: '恒瑞医药',
    date: ['2025.8.12', '2025.8.15'],
    amount: 100,
    costPrice: 75.35,
    sellPrice: 81.5,
    serviceFee: 55,
  },
  {
    code: '02631',
    share: '天岳先进',
    date: '2025.8.18',
    amount: 100,
    costPrice: 42.8,
    status: TShareRowStatus.BUYING,
  },
  {
    code: '02631',
    share: '天岳先进',
    date: '2025.8.22',
    amount: 100,
    costPrice: 44.76,
    status: TShareRowStatus.BUYING,
  },
  {
    code: '02631',
    share: '天岳先进',
    date: '2025.9.5',
    serviceFee: 96,
    sellPrice: 49.78
  },
  {
    code: '02595',
    share: '劲方医药',
    date: '2025.9.22',
    amount: 100,
    costPrice: 41,
    status: TShareRowStatus.BUYING,
  },
  {
    code: '02595',
    share: '劲方医药',
    date: '2025.10.9',
    amount: 100,
    costPrice: 37,
    status: TShareRowStatus.BUYING,
  },
] as TShareRow[])
export const HKSharesSum: TShareSum = handleSum(HKShares)

export const USShares = handleData([
  {
    code: 'CHA',
    share: '霸王茶姬',
    date: ['2025.4.23', '2025.4.29'],
    amount: 4,
    costPrice: 31,
    sellPrice: 33.5,
    serviceFee: 4.02,
  },
] as TShareRow[])
export const USSharesSum: TShareSum = handleSum(USShares)

export const AShares = handleData([
  {
    code: '600654',
    share: '中安科',
    date: ['2025.8.7', '2025.8.7'],
    amount: 1000,
    costPrice: 3.35,
    sellPrice: 3.37,
    serviceFee: 11.69,
  },
] as TShareRow[])
export const ASharesSum = handleSum(AShares)
