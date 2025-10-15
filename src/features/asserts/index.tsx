import { Main } from '@/components/layout/main'
import NumberCardList from '@/components/number-card-list'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { BalanceTable, IncomeTable, OutcomeTable } from './table'
import YearPicker, { defaultYear } from '@/components/year-picker'
import { useState } from 'react'
import {
  BalanceTable as BalanceTableData,
  IncomeTable as IncomeTableData,
  OutcomeTable as OutcomeTableData,
  NumberCardListData,
} from '@/data/asserts'
import DashboardHeader from '@/components/dashboard-header'

const Comps = [
  { key: 'Balance', label: '资产负债表', comp: BalanceTable, data: BalanceTableData },
  { key: 'Income', label: '收入表', comp: IncomeTable, data: IncomeTableData },
  { key: 'Outcome', label: '支出表', comp: OutcomeTable, data: OutcomeTableData },
]

export default function Asserts() {
  const [curYear, setYear] = useState(+defaultYear)

  return <>
    <DashboardHeader />
    <Main>
      <NumberCardList data={NumberCardListData} />
      <div className='mt-8 grid gap-4 sm:grid-cols-1 lg:grid-cols-1 overflow-hidden'>
        <Tabs
          orientation='vertical'
          defaultValue={Comps[0].key}
          className='w-full overflow-x-auto space-y-2'
        >
          <div className='w-full overflow-x-auto flex justify-between'>
            <TabsList>
              {Comps.map(row => <TabsTrigger key={row.key} value={row.key}>{row.label}</TabsTrigger>)}
            </TabsList>
            <YearPicker onChange={(d) => setYear(d)} />
          </div>
          {Comps.map(row => <TabsContent className='space-y-4' key={row.key} value={row.key}>
            {row.comp({ data: row.data.filter(d => curYear === 0 ? true : d.year === curYear) })}
          </TabsContent>)}
        </Tabs>
      </div>
    </Main>
  </>
}
