import { Line, LineChart as RLineChart, XAxis, YAxis } from 'recharts'
import { ColumnKeys, getColumnAlias, type TColumnKeys } from '@/lib/const'
import { formatNumber, isMobile } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart'

interface Props<T = Record<string, number | string | Array<unknown>>> {
  dataKeys: (keyof T)[]
  complexDataKeys?: (keyof T)[]
  data: Array<T>
}

export default function LineChart({ dataKeys, complexDataKeys = [], data }: Props) {
  const newDataKeys = [...dataKeys, ...complexDataKeys]
  const newData = [...data]
  complexDataKeys.forEach((key) => {
    const [first, second] = key.split('_') as unknown as [keyof Props['data'][number], string]
    newData.forEach(row => {
      row[key] = (row[first] as Array<{ abbr: string, header: string, value: number }>).find((r) => r.header === second || r.abbr === second)?.value ?? 0
    })
  })
  

  const chartConfig = Object.fromEntries(
    newDataKeys.map((key) => {
      return [
        key,
        { label: ColumnKeys[key as TColumnKeys] || getColumnAlias(key) || 'x', color: 'var(--foreground)' },
      ]
    })
  )
  const tickFormatterY = (label: string) => {
    return formatNumber(+label, 'CNY').slice(0, -3)
  }

  return (
    <Card className={`${isMobile() && 'gap-2 pt-4 pb-0'}`}>
      <CardContent className={`${isMobile() && 'pr-4 pl-0'}`}>
        <ChartContainer config={chartConfig}>
            <RLineChart data={newData}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent nameKey='' payload={[]} />} />
              <XAxis
                dataKey='month'
                stroke='#888888'
                fontSize={12}
                tickFormatter={(label) => label.slice(0, 3)}
              />
              <YAxis
                stroke='#888888'
                fontSize={12}
                tickFormatter={tickFormatterY}
              />
              {newDataKeys.map((key) => (
                <Line
                  dataKey={key}
                  className='fill-primary'
                  type='monotone'
                  strokeWidth={2}
                  stroke='var(--foreground)'
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </RLineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
