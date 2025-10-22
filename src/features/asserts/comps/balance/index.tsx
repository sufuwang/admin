import Line from './line'
import Pie from '../pie'
import Table from './table'
import { BalanceTableSum } from '@/data/asserts'

export default function Resume() {
  return (
    <>
      <Table />
      <div className='grid gap-4 grid-cols-1 lg:grid-cols-2'>
        <Line />
        <Pie data={BalanceTableSum} dataKeys={['totalIncome', 'totalOutcome']} />
      </div>
    </>
  )
}
