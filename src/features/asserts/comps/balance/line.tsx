import { LineChart, Line as RLine, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
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
import Card from '@/components/base-card'

type Row = TBalanceTableRow & {
  balances_CNY: number
  balances_HKD: number
}

export default function Line() {
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
    <Card title='数据走势' description='2025年资产负债表中重要数据走势'>
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
              <RLine
                type='monotone'
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
    </Card>
  )
}
