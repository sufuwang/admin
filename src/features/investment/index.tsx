import { Main } from '@/components/layout/main'
import DashboardHeader from '@/components/dashboard-header'
import Stock from './comps/stock'

export default function Investment() {
  return <>
    <DashboardHeader />
    <Main>
      <Stock />
    </Main>
  </>
}