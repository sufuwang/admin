import { differenceInDays } from 'date-fns'

export type TShareMarket = 'A' | 'HK' | 'US'
export enum TShareRowStatus {
  PROFIT = 'PROFIT',
  LOSS = 'LOSS',
  BUYING = 'BUYING',
}

export type TShareRow =
  | Readonly<{
      code: string
      share: string
      date: [string, string]
      days: number
      amount: number
      costPrice: number
      sellPrice: number
      serviceFee: number
      earning: number
      earningRate: string
      status: Exclude<TShareRowStatus, 'BUYING'> | '-'
    }>
  | Readonly<{
      code: string
      share: string
      date: string
      amount: number
      costPrice: number
      serviceFee: number
      status: TShareRowStatus.BUYING
      days: undefined
      sellPrice: undefined
      earning: undefined
      earningRate: undefined
    }>

export type TShareRowKeys = AllKeys<TShareRow>

export interface TShareSum {
  cost: number
  earning: number
  serviceFee: number
  earningRate: number
}

const handleData = (shares: Partial<TShareRow>[]) => {
  return shares.map((row) => {
    if (row.status === TShareRowStatus.BUYING) {
      return row as TShareRow
    }
    if (row.amount && row.date && row.costPrice && row.sellPrice && row.serviceFee) {
      const earning =
        row.amount * (row.sellPrice - row.costPrice) - row.serviceFee
      const earningRate =
        (100 * earning / (row.amount * row.costPrice)).toFixed(2) + '%'
      return {
        ...row,
        date: [row.date[0], row.date[1]] as [string, string],
        days: differenceInDays(row.date[1].replaceAll('.', '-'), row.date[0].replaceAll('.', '-')),
        earning,
        earningRate,
        status: earning === 0 ? '-' : earning > 0 ? TShareRowStatus.PROFIT : TShareRowStatus.LOSS,
      } as TShareRow
    }
    return row as TShareRow
  })
}
const handleSum = (shares: TShareRow[]) => {
  const sum = { cost: 0, serviceFee: 0, earning: 0, earningRate: 0 }
  shares.reduce((acc, row) => {
    if ([TShareRowStatus.BUYING, '-'].includes(row.status)) {
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
  },
  {
    code: '',
    share: '美团（腾讯派息）',
    date: ['2021.7.1', '2025.2.17'],
    amount: 1,
    costPrice: 197.8,
    sellPrice: 197.8,
    serviceFee: 0,
  },
  {
    code: '',
    share: '沪上阿姨',
    date: ['2025.5.6', '2025.5.12'],
    amount: 30,
    costPrice: 181,
    sellPrice: 126.3,
    serviceFee: 50.79,
  },
  {
    code: '',
    share: '宁德时代',
    date: ['2025.5.20', '2025.5.20'],
    amount: 10,
    costPrice: 295,
    sellPrice: 299,
    serviceFee: 46.5,
  },

  {
    code: '',
    share: '劲方医药-B',
    date: '2025.9.22',
    amount: 100,
    costPrice: 41,
    serviceFee: 23.52,
    status: TShareRowStatus.BUYING,
  },
])
export const HKSharesSum: TShareSum = handleSum(HKShares)

export const USShares = handleData([
  {
    code: '',
    share: '霸王茶姬',
    date: ['2025.4.23', '2025.4.29'],
    days: 0,
    amount: 4,
    costPrice: 31,
    sellPrice: 33.5,
    serviceFee: 4.02,
    status: '-',
    earning: 0,
    earningRate: '',
  },
])
export const USSharesSum: TShareSum = handleSum(USShares)

// export const AShares: TShareRow[] = []
// export const ASharesSum: TShareSum = {
//   cost: 0,
//   earning: 0,
//   serviceFee: 0,
//   earningRate: 0,
// }
