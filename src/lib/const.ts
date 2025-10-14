export const Currencies = [
  { abbr: 'USD', name: '美元' },
  { abbr: 'CNY', name: '人民币' },
  { abbr: 'HKD', name: '港币' },
  { abbr: 'JPY', name: '日元' },
  { abbr: 'KRW', name: '韩元' },
  { abbr: 'EUR', name: '欧元' },
  { abbr: 'GBP', name: '英镑' },
  { abbr: 'AUD', name: '澳大利亚元' },
  { abbr: 'CAD', name: '加拿大元' },
  { abbr: 'NZD', name: '新西兰元' },
  { abbr: 'CHF', name: '瑞士法郎' },
  { abbr: 'SGD', name: '新加坡元' },
  { abbr: 'THB', name: '泰铢' },
  { abbr: 'MYR', name: '马来西亚令吉' },
  { abbr: 'IDR', name: '印尼盾' },
  { abbr: 'INR', name: '印度卢比' },
  { abbr: 'PHP', name: '菲律宾比索' },
  { abbr: 'VND', name: '越南盾' },
  { abbr: 'RUB', name: '俄罗斯卢布' },
  { abbr: 'BRL', name: '巴西雷亚尔' },
  { abbr: 'MXN', name: '墨西哥比索' },
  { abbr: 'ZAR', name: '南非兰特' },
  { abbr: 'AED', name: '阿联酋迪拉姆' },
  { abbr: 'SAR', name: '沙特里亚尔' },
  { abbr: 'TRY', name: '土耳其里拉' },
] as const
export type TCurrency = (typeof Currencies)[number]

export const ColumnKeys = {
  year: '年份',
  month: '月份',
  totalIncome: '总收入',
  totalOutcome: '总支出',
  totalPureIncome: '净收入',
  comment: '备注',
  wageIncome: '工资收入',
  fundIncome: '公积金收入',
  partTimeIncome: '兼职收入',
  investmentIncome: '投资收入',
  otherIncome: '其他收入',
  transferIncome: '转移支付收入',
  houseOutcome: '住房支出',
  foodOutcome: '餐饮支出',
  transportOutcome: '交通支出',
  relativeOutcome: '亲属支出',
  specialOutcome: '特殊支出',
  bulkOutcome: '大宗支出',
  otherOutcome: '其他支出'
} as const
export type TColumnKeys = keyof typeof ColumnKeys
export const getColumnAlias = (name: string) => {
  if (name.startsWith('balance_')) {
    const parts = name.split('_')
    if (parts.length === 2) {
      const [_, abbr] = parts
      const currency = Currencies.find(c => c.abbr === abbr)
      return currency ? `${currency.name}余额` : name
    } else if (parts.length === 3) {
      const [_, abbr, suffix] = parts
      const currency = Currencies.find(c => c.abbr === abbr)
      if (currency) {
        if (suffix === 'MoM') return `${currency.name}余额环比`
        if (suffix === 'YoY') return `${currency.name}余额同比`
      }
    }
  }
  return name
}