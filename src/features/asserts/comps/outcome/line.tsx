import { OutcomeTableData, type TOutcomeTableRow } from '@/data/asserts'
import {
  LineChart,
  Line as RLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { ColumnKeys, getColumnAlias, type TColumnKeys } from '@/lib/const'
import { formatNumber, getColor } from '@/lib/utils'
import useLegends, { type Legend } from '@/hooks/use-legends'
import { Card, CardContent } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'

const defaultLegends: Legend[] = [
  {
    key: 'loans',
    label: '房贷还款',
    dataKey: (row: TOutcomeTableRow) => {
      return row.loans?.[0].value ?? 0
    },
    visible: true,
  },
  ...[
    'houseOutcome',
    'foodOutcome',
    'transportOutcome',
    'relativeOutcome',
    'specialOutcome',
    'bulkOutcome',
    'otherOutcome',
    'totalOutcome',
  ].map((key) => ({ key, visible: true })),
]

export default function Line() {
  const { legends, onClickLegend } = useLegends({
    id: 'outcome',
    defaultLegends,
  })

  const chartConfig = Object.fromEntries(
    legends.map(({ key, label }, index) => {
      return [
        key,
        {
          label:
            label ||
            ColumnKeys[key as TColumnKeys] ||
            getColumnAlias(key) ||
            'x',
          color: getColor(index),
        },
      ]
    })
  )

  return (
    <Card className='w-full p-2 pb-0 lg:p-4 lg:pb-2'>
      <CardContent className='p-0'>
        <ChartContainer config={chartConfig}>
          <LineChart data={OutcomeTableData}>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend
              content={
                <ChartLegendContent
                  defaultLegendsValue={defaultLegends}
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
            {defaultLegends.map((row, index) => (
              <RLine
                type='monotone'
                dot={{ r: 4 }}
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dataKey={row.dataKey ?? row.key}
                name={row.key}
                hide={!legends.find((l) => l.key === row.key)?.visible}
                stroke={getColor(index)}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
