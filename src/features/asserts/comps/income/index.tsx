import { IncomeTableSum } from '@/data/asserts'
import Line from './line'
import Pie from '../pie'
import Table from './table'

export default function Resume() {
  return (
    <>
      <Table />
      <div className='grid gap-4 grid-cols-1 lg:grid-cols-2'>
        <Line />
        <Pie data={IncomeTableSum} dataKeys={['fundIncome', 'investmentIncome', 'partTimeIncome', 'transferIncome', 'wageIncome', 'otherIncome']} />
      </div>
    </>
  )
}
