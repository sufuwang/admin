import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { BalanceTableData, type TBalanceTableRow } from '@/data/asserts'
import { formatNumber, getColor } from '@/lib/utils'
import { ColumnKeys, getColumnAlias, type TColumnKeys } from '@/lib/const'
import useLegends from '@/hooks/use-legends'

type Row = TBalanceTableRow & {
  balances_CNY: number
  balances_HKD: number
}

export default function RevenueChart() {
  const { legends, onClickLegend } = useLegends({ id: 'balance', defaultLegends: ['totalIncome', 'totalOutcome', 'balances_CNY', 'balances_HKD'].map(key => ({ key, visible: true })) })

  const data: Row[] = BalanceTableData.map(row => {
    return { ...row,
      balances_CNY: row.balances?.find(r => r.abbr === 'CNY')?.value || 0,
      balances_HKD: row.balances?.find(r => r.abbr === 'HKD')?.value || 0
    }
  })

  const chartConfig = Object.fromEntries(
    legends.map(({ key }, index) => {
      return [
        key,
        {
          label: ColumnKeys[key as TColumnKeys] || getColumnAlias(key) || 'x',
          color: getColor(index),
        },
      ]
    })
  )

  return (
    <Card className='w-full'>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={data}>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend
              content={
                <ChartLegendContent
                  defaultLegendsValue={legends}
                  onClickLegend={onClickLegend}
                />
              }
            />
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
            <XAxis
              dataKey='month'
              stroke='#888888'
              fontSize={12}
              tickFormatter={(label) => {
                const txt = label.toString()
                return txt.length > 3 ? txt.slice(0, 3) : txt
              }}
            />
            <YAxis
              stroke='#888888'
              fontSize={12}
              tickFormatter={(label) => formatNumber(+label, 'CNY').slice(0, -3)}
            />
            <Tooltip />
            {
              legends.map((row, index) => (
                <Line
                  type='monotone'
                  // className='fill-primary'
                  dot={{ r: 4 }}
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  dataKey={row.key}
                  hide={!row.visible}
                  stroke={getColor(index)}
                />
              ))
            }
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
