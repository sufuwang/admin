// import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Analytics } from './components/analytics'
import Asserts from './components/asserts'
// import YearPicker from '@/components/year-picker'

const Comps = [
  { key: 'Asserts', label: '流水', comp: Asserts },
  { key: 'Analytics', label: '投资', comp: Analytics },
]

export function Dashboard() {
  // const [curYear, setYear] = useState(2025)
  
  return (
    <>
      <Header />
      <Main>
        <Tabs
          orientation='vertical'
          defaultValue={Comps[0].key}
          className='space-y-2'
        >
          <div className='w-full overflow-x-auto flex justify-between'>
            <TabsList>
              {Comps.map(row => <TabsTrigger value={row.key}>{row.label}</TabsTrigger>)}
            </TabsList>
            {/* <YearPicker /> */}
          </div>
          {Comps.map(row => <TabsContent value={row.key} className='space-y-4'>
            {row.comp()}
          </TabsContent>)}
        </Tabs>
      </Main>
    </>
  )
}
