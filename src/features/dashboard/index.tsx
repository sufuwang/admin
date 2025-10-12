import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Analytics } from './components/analytics'
import Asserts from './components/asserts'

const Comps = [
  { key: 'Asserts', label: '流水', comp: Asserts },
  { key: 'Analytics', label: '投资', comp: Analytics },
]

export function Dashboard() {
  return (
    <>
      <Header>
      </Header>
      <Main>
        <Tabs
          orientation='vertical'
          defaultValue={Comps[0].key}
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2 flex justify-between'>
            <TabsList>
              {Comps.map(row => <TabsTrigger value={row.key}>{row.label}</TabsTrigger>)}
            </TabsList>
            <Select defaultValue="">
              <SelectTrigger>
                <SelectValue placeholder="YYYY" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {Comps.map(row => <TabsContent value={row.key} className='space-y-4'>
            {row.comp()}
          </TabsContent>)}
        </Tabs>
      </Main>
    </>
  )
}
