import { PieChart, Pie as RPie, Cell } from 'recharts'
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

interface Props<T extends Record<string, number>> {
  data: T
  dataKeys?: (keyof T)[]
}

const getLabel = (key: string) => {
  if (key === 'loans') {
    return '房贷还款'
  }
  return ColumnKeys[key as TColumnKeys] || i18n[key as keyof Ti18n] || getColumnAlias(key) || key
}

export default function Pie<T extends Record<string, number>>(props: Props<T>) {
  const _data = Object.entries(props.data)
    .filter(([dataKey]) => props.dataKeys?.length ? props.dataKeys.includes(dataKey) : true)
    .sort((a, b) => a[1] > b[1] ? -1 : 1)
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
    <Card className='py-0 lg:py-2'>
      <CardContent className='p-0'>
        <ChartContainer config={chartConfig}>
          <PieChart margin={{ top: isMobile() ? 26 : 16, bottom: 10 }}>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend className='mt-4' content={<ChartLegendContent />} />
            <RPie
              data={data}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${getLabel(name)}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((row, index) => <Cell key={`cell-${row.name}`} fill={getColor(index)} />)}
            </RPie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
