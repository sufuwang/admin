import { Main } from '@/components/layout/main'
import NumberCardList from '@/components/number-card-list'
import { data as AssetsData } from '@/data/asserts'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { BalanceTable, IncomeTable, OutcomeTable } from './table'
import YearPicker, { defaultYear } from '@/components/year-picker'
import { useState } from 'react'

const Comps = [
  { key: 'Balance', label: '资产负债表', comp: BalanceTable },
  { key: 'Income', label: '收入表', comp: IncomeTable },
  { key: 'Outcome', label: '支出表', comp: OutcomeTable },
]

export default function Asserts() {
  const [curYear, setYear] = useState(+defaultYear)

  return <Main>
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
      <NumberCardList data={AssetsData} />
    </div>

    <div className='mt-8 grid gap-4 sm:grid-cols-1 lg:grid-cols-1'>
      <Tabs
        orientation='vertical'
        defaultValue={Comps[0].key}
        className='space-y-2'
      >
        <div className='w-full overflow-x-auto flex justify-between'>
          <TabsList>
            {Comps.map(row => <TabsTrigger value={row.key}>{row.label}</TabsTrigger>)}
          </TabsList>
          <YearPicker onChange={(d) => setYear(d)} />
        </div>
        {Comps.map(row => <TabsContent value={row.key} className='space-y-4'>
          {row.comp({ year: curYear })}
        </TabsContent>)}
      </Tabs>
    </div>
  </Main>
}
