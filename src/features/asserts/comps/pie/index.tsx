import { PieChart as RPieChart, Pie, Cell } from 'recharts'
import { ColumnKeys, getColumnAlias, i18n, type TColumnKeys, type Ti18n } from '@/lib/const'
import { isMobile, getColor } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import type { TBalanceTableSum, TIncomeTableSum, TOutcomeTableSum, TResumeTableRowSum } from '@/data/asserts'

interface Props {
  data: TBalanceTableSum | TIncomeTableSum | TOutcomeTableSum | TResumeTableRowSum
}

const getLabel = (key: string) => {
  return ColumnKeys[key as TColumnKeys] || i18n[key as keyof Ti18n] || getColumnAlias(key) || key
}

export default function PieChart(props: Props) {
  const _data = Object.entries(props.data).sort((a, b) => a[1] > b[1] ? -1 : 1)
  const data = ([
    ..._data.slice(0, 4),
    ['restCategories', _data.slice(4).reduce((a, b) => a + b[1], 0) ]
  ] as [string, number][]).filter(row => row[1] !== 0).map(item => ({ name: item[0], value: +item[1].toFixed(2) }))

  const chartConfig = Object.fromEntries(
    data.map((row, index) => {
      return [
        row.name,
        {
          label: getLabel(row.name),
          color: getColor(index),
        },
      ]
    })
  )

  return (
    <Card className={`py-4 ${isMobile() && 'gap-0 pt-2 pb-0'} justify-center`}>
      <CardContent className={`px-4 ${isMobile() && 'px-2 pt-0 pb-2'}`}>
        <ChartContainer config={chartConfig}>
          <RPieChart margin={{ top: isMobile() ? 28 : 10, bottom: 10 }}>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend className='mt-4' content={<ChartLegendContent />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${getLabel(name)}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((row, index) => <Cell key={`cell-${row.name}`} fill={getColor(index)} />)}
            </Pie>
          </RPieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
