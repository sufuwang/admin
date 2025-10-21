import { IncomeTableData } from '@/data/asserts'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { ColumnKeys, getColumnAlias, type TColumnKeys } from '@/lib/const'
import { formatNumber, getColor } from '@/lib/utils'
import useLegends from '@/hooks/use-legends'
import { Card, CardContent } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'

export default function RevenueChart() {
  const { legends, onClickLegend } = useLegends({
    id: 'income',
    defaultLegends: [
      'wageIncome',
      'fundIncome',
      'partTimeIncome',
      'investmentIncome',
      'otherIncome',
      'totalPureIncome',
      'transferIncome',
      'totalIncome',
    ].map((key) => ({ key, visible: true })),
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
    <Card className='w-full p-2 pb-0 lg:p-4 lg:pb-2'>
      <CardContent className='p-0'>
        <ChartContainer config={chartConfig}>
          <LineChart data={IncomeTableData}>
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
              tickFormatter={(label) =>
                formatNumber(+label, 'CNY').slice(0, -3)
              }
            />
            <Tooltip />
            {legends.map((row, index) => (
              <Line
                type='monotone'
                dot={{ r: 4 }}
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dataKey={row.key}
                hide={!row.visible}
                stroke={getColor(index)}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
