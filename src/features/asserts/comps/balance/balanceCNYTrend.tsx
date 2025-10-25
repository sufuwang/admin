import { setMonth, format } from 'date-fns'
import {
  BalanceTableData,
  IncomeTableSum,
  OutcomeTableSum,
} from '@/data/asserts'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { formatNumber, getColor } from '@/lib/utils'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import Card from '@/components/base-card'

export default function BalanceCNYTrend() {
  const incomeAverage = IncomeTableSum.totalPureIncome / BalanceTableData.length
  const outcomeAverage = (OutcomeTableSum.totalOutcome - OutcomeTableSum.loans) / BalanceTableData.length
  const average = incomeAverage - outcomeAverage
  const curBalanceCNY = BalanceTableData.at(-1)!.balances!.find((r) => r.abbr === 'CNY')?.value ?? 0

  const data = new Array(12).fill(0).map((_, index) => {
    const row = BalanceTableData[index]
    if (row) {
      const balance_CNY = row.balances?.find((r) => r.abbr === 'CNY')?.value ?? 0
      const res: Record<string, string | number> = { month: row.month, balance_CNY }
      if (BalanceTableData[index + 1] === undefined) {
        res.balance_CNY_Trend = res.balance_CNY
      }
      return res
    }
    return {
      month: format(setMonth(new Date(2025, 0, 1), index), 'MMMM'),
      balance_CNY_Trend: curBalanceCNY + average * (index - BalanceTableData.length + 1),
    }
  })

  const chartConfig = {
    balance_CNY: {
      label: '余额',
      color: getColor(0),
    },
    balance_CNY_Trend: {
      label: '预测余额',
      color: getColor(1),
    },
  }

  return (
    <Card title='人民币余额趋势' description='下月余额=当月余额+月均净收入-月均支出(除去房贷还款)'>
      <ChartContainer config={chartConfig}>
        <LineChart data={data}>
          <ChartTooltip content={<ChartTooltipContent />} />
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
          <Line
            type='monotone'
            dot={{ r: 4 }}
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dataKey='balance_CNY'
            stroke={getColor(0)}
          />
          <Line
            type='monotone'
            dot={{ r: 4 }}
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dataKey='balance_CNY_Trend'
            stroke={getColor(1)}
          />
        </LineChart>
      </ChartContainer>
    </Card>
  )
}
