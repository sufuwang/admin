import { useEffect, useState } from 'react'
import { Line, LineChart as RLineChart, XAxis, YAxis } from 'recharts'
import { ColumnKeys, getColumnAlias, type TColumnKeys } from '@/lib/const'
import { formatNumber, isMobile, getColor } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props<T = Record<string, any>> {
  id: string
  dataKeys: (keyof T)[]
  complexDataKeys?: (keyof T)[]
  data: Array<T>
}

export default function LineChart({
  id,
  dataKeys,
  complexDataKeys = [],
  data,
}: Props) {
  const newDataKeys = [...dataKeys, ...complexDataKeys]
  const newData = [...data]
  complexDataKeys.forEach((key) => {
    const [first, second] = key.split('_') as unknown as [
      keyof Props['data'][number],
      string,
    ]
    newData.forEach((row) => {
      row[key] =
        (
          row[first] as Array<{ abbr: string; header: string; value: number }>
        ).find((r) => r.header === second || r.abbr === second)?.value ?? 0
    })
  })
  const chartConfig = Object.fromEntries(
    newDataKeys.map((key, index) => {
      return [
        key,
        {
          label: ColumnKeys[key as TColumnKeys] || getColumnAlias(key) || 'x',
          color: getColor(index),
        },
      ]
    })
  )

  const cacheName = `${id}_line_chart_legend`
  const cache = JSON.parse(localStorage.getItem(cacheName) ?? '[]')
  const defaultLegendsValue = cache.length
    ? cache
    : newDataKeys.map((key) => ({ key, visible: true }))
  const [legends, setLegends] =
    useState<{ key: string; visible: boolean }[]>(defaultLegendsValue)
  useEffect(() => {
    localStorage.setItem(cacheName, JSON.stringify(legends))
  }, [legends])
  const onClickLegend = (key: string, visible: boolean) => {
    const d = [...legends]
    d.find((row) => row.key === key)!.visible = visible
    setLegends(d)
  }

  const tickFormatterY = (label: string) => {
    return formatNumber(+label, 'CNY').slice(0, -3)
  }

  return (
    <Card className={`py-4 ${isMobile() && 'gap-0 pt-2 pb-0'} justify-center`}>
      <CardContent className={`px-4 ${isMobile() && 'py-4 pr-4 pl-2'}`}>
        <ChartContainer config={chartConfig}>
          <RLineChart data={newData}>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend
              content={
                <ChartLegendContent
                  defaultValue={defaultLegendsValue}
                  onClickLegend={onClickLegend}
                />
              }
            />
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
              tickFormatter={tickFormatterY}
            />
            {legends.map((row, index) => (
              <Line
                dataKey={row.key}
                hide={!row.visible}
                className='fill-primary'
                type='monotone'
                strokeWidth={2}
                stroke={getColor(index)}
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
