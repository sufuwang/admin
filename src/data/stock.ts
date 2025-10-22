export type TShareMarket = 'A' | 'HK' | 'US'
export enum TShareRowStatus {
  PROFIT = 'PROFIT',
  LOSS = 'LOSS',
  BUYING = 'BUYING',
}

export type TShareRow =
  | Readonly<{
      code: string
      name: string
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
      name: string
      date: string
      amount: number
      costPrice: number
      serviceFee: number
      status: TShareRowStatus.BUYING
    }>

export type TShareRowKeys = AllKeys<TShareRow>

export const AShares = [
  {
    code: '00700',
    name: '腾讯',
    date: ['2021.7.1', '2025.2.17'],
    days: 0,
    amount: 67,
    costPrice: 500,
    sellPrice: 500,
    serviceFee: 0,
  },
  {
    code: '',
    name: '美团（腾讯派息）',
    date: ['2021.7.1', '2025.2.17'],
    amount: 1,
    costPrice: 197.8,
    sellPrice: 197.8,
    serviceFee: 0,
  },
  {
    code: '',
    name: '沪上阿姨',
    date: ['2025.5.6', '2025.5.12'],
    amount: 30,
    costPrice: 181,
    sellPrice: 126.3,
    serviceFee: 50.79,
  },
  {
    code: '',
    name: '宁德时代',
    date: ['2025.5.20', '2025.5.20'],
    amount: 10,
    costPrice: 295,
    sellPrice: 299,
    serviceFee: 46.5,
  },

  {
    code: '',
    name: '劲方医药-B',
    date: '2025.9.22',
    amount: 100,
    costPrice: 41,
    serviceFee: 23.52,
    status: TShareRowStatus.BUYING,
  },
].map((row) => {
  row.days = 0
  if (row.status === TShareRowStatus.BUYING) {
    return row
  }
  if (!row.status) {
    const earning =
      row.amount * (row.sellPrice - row.costPrice) - row.serviceFee
    const earningRate =
      ((100 * earning) / (row.amount * row.costPrice)).toFixed(2) + '%'
    return {
      ...row,
      date: [row.date[0], row.date[1]] as [string, string],
      days: 0,
      earning,
      earningRate,
      status: earning === 0 ? '-' : earning > 0 ? TShareRowStatus.PROFIT : TShareRowStatus.LOSS,
    } as TShareRow
  }
  return row
})
