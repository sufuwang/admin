import { useState } from 'react'
import {
  BalanceTable as BalanceTableData,
  IncomeTable as IncomeTableData,
  OutcomeTable as OutcomeTableData,
  ResumeTable as ResumeTableData,
  NumberCardListData,
  BalanceTableSum,
  IncomeTableSum,
  OutcomeTableSum,
} from '@/data/asserts'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import DashboardHeader from '@/components/dashboard-header'
import { Main } from '@/components/layout/main'
import NumberCardList from '@/components/number-card-list'
import YearPicker, { defaultYear } from '@/components/year-picker'
import LineChart from './line-chart'
import PieChart from './pie-chart'
import { BalanceTable, IncomeTable, OutcomeTable, ResumeTable } from './table'

const Comps = [
  {
    key: 'Balance',
    label: '资产负债表',
    table: {
      comp: BalanceTable,
      data: BalanceTableData,
    },
    lineChart: {
      dataKeys: ['totalIncome', 'totalOutcome'],
      complexDataKeys: ['balances_CNY', 'balances_HKD']
    },
    pieChart: {
      data: BalanceTableSum
    }
  },
  {
    key: 'Income',
    label: '收入表',
    table: {
      comp: IncomeTable,
      data: IncomeTableData,
    },
    lineChart: {
      dataKeys: [
        'wageIncome',
        'fundIncome',
        'partTimeIncome',
        'investmentIncome',
        'otherIncome',
        'totalPureIncome',
        'transferIncome',
      ],
    },
    pieChart: {
      data: IncomeTableSum
    }
  },
  {
    key: 'Outcome',
    label: '支出表',
    table: {
      comp: OutcomeTable,
      data: OutcomeTableData,
    },
    lineChart: {
      dataKeys: [
        'houseOutcome',
        'foodOutcome',
        'transportOutcome',
        'relativeOutcome',
        'specialOutcome',
        'bulkOutcome',
        // 'otherOutcome',
      ],
      complexDataKeys: ['loans_房贷还款']
    },
    pieChart: {
      data: OutcomeTableSum
    }
  },
  {
    key: 'Resume',
    label: '履历表',
    table: {
      comp: ResumeTable,
      data: ResumeTableData,
    },
  },
]

export default function Asserts() {
  const [curYear, setYear] = useState(+defaultYear)

  return (
    <>
      <DashboardHeader />
      <Main>
        <NumberCardList data={NumberCardListData} />
        <div className='mt-8 grid gap-4 overflow-hidden sm:grid-cols-1 lg:grid-cols-1'>
          <Tabs
            orientation='vertical'
            defaultValue={Comps[0].key}
            className='w-full space-y-2 overflow-x-auto'
          >
            <div className='flex w-full justify-between overflow-x-auto'>
              <TabsList>
                {Comps.map((row) => (
                  <TabsTrigger key={row.key} value={row.key}>
                    {row.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <YearPicker onChange={(d) => setYear(d)} />
            </div>
            {Comps.map((row) => {
              const data = row.table.data.filter((d) => {
                if ((d as { year?: number }).year === undefined) {
                  return true
                }
                return curYear === 0 ? true : (d as { year?: number }).year === curYear
              })
              return (
                <TabsContent
                  className='space-y-4'
                  key={row.key}
                  value={row.key}
                >
                  {row.table.comp({ data })}
                  <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                    {row.lineChart && <LineChart id={row.key} dataKeys={row.lineChart.dataKeys} complexDataKeys={row.lineChart.complexDataKeys} data={data} />}
                    {row.pieChart && <PieChart data={row.pieChart.data} />}
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>
        </div>
      </Main>
    </>
  )
}
