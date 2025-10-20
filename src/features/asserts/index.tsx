import {
  NumberCardListData,
} from '@/data/asserts'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import DashboardHeader from '@/components/dashboard-header'
import { Main } from '@/components/layout/main'
import NumberCardList from '@/components/number-card-list'
// import LineChart from './line-chart'
// import PieChart from './pie-chart'
// import { BalanceTableData } from './table'

import Balance from './comps/balance'
import Income from './comps/income'
import Outcome from './comps/outcome'
import Resume from './comps/resume'

const Comps = [
  {
    key: 'Balance',
    label: '资产负债表',
    comp: Balance,
  },
  {
    key: 'Income',
    label: '收入表',
    comp: Income,
  },
  {
    key: 'Outcome',
    label: '支出表',
    comp: Outcome,
  },
  {
    key: 'Resume',
    label: '履历表',
    comp: Resume,
  },
]

export default function Asserts() {
  // const [curYear, setYear] = useState(+defaultYear)

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
              {/* <YearPicker onChange={(d) => setYear(d)} /> */}
            </div>
            {Comps.map((row) => {
              return (
                <TabsContent
                  className='space-y-4'
                  key={row.key}
                  value={row.key}
                >
                  {row.comp()}
                  {/* <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                    {row.lineChart && <LineChart id={row.key} dataKeys={row.lineChart.dataKeys} complexDataKeys={row.lineChart.complexDataKeys} data={data} />}
                    {row.pieChart && <PieChart data={row.pieChart.data} />}
                  </div> */}
                </TabsContent>
              )
            })}
          </Tabs>
        </div>
      </Main>
    </>
  )
}
