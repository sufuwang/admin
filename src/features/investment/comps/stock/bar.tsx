import { type JSX } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { HKSharesSum, USSharesSum, ASharesSum } from '@/data/stock'
import { ExchangeRate, ExchangeRateType } from '@/lib/const'
import { formatNumber } from '@/lib/utils'

const data = [
  { name: '港股', value: HKSharesSum.earning, exchange: ExchangeRateType.UKDToCNY },
  { name: '美股', value: USSharesSum.earning, exchange: ExchangeRateType.USToCNY },
  { name: 'A股', value: ASharesSum.earning }
]
  .map(row => ({ ...row, value: +(row.value * (row.exchange ? ExchangeRate[row.exchange] : 1)).toFixed(2) }))
  .sort((a, b) => a.value - b.value > 0 ? -1 : 1)
  .map(row => ({ ...row, renderValue: (value: number) => formatNumber(value, 'CNY') }))

  

function Bar({
  items,
  barClass,
}: {
  items: { name: string; value: number; renderValue: (value: number) => string | JSX.Element }[]
  barClass: string
}) {
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <ul className='space-y-3'>
      {items.map((i) => {
        const width = `${Math.max(Math.round((i.value / max) * 100), 0)}%`
        return (
          <li key={i.name} className='flex items-end justify-between'>
            <div className='min-w-0 flex-1'>
              <div className='text-muted-foreground mb-1 truncate text-xs'>
                {i.name}
              </div>
              <div className='bg-muted h-2.5 w-full rounded-full'>
                <div
                  className={`h-2.5 rounded-full ${barClass}`}
                  style={{ width }}
                />
              </div>
            </div>
            <div className='ps-2 text-xs font-medium tabular-nums min-w-[60px] text-right'>{i.renderValue ? i.renderValue(i.value) : i.value}</div>
          </li>
        )
      })}
    </ul>
  )
}

export default function BarCard() {
  return <Card className='p-4 lg:p-6'>
    <CardHeader className='p-0'>
      <CardTitle>收益榜单</CardTitle>
      <CardDescription>各个投资行为的收益情况</CardDescription>
    </CardHeader>
    <CardContent className='p-0'>
      <Bar
        items={data}
        barClass='bg-primary'
      />
    </CardContent>
  </Card>
}