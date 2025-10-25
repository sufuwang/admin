import { IncomeTableSum } from '@/data/asserts'
import Pie from '../pie'
import Line from './line'
import Table from './table'

export default function Resume() {
  return (
    <>
      <Table />
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <Line />
        <Pie
          title='数据占比'
          description='2025年收入表中重要数据占比'
          data={IncomeTableSum}
          dataKeys={[
            'fundIncome',
            'investmentIncome',
            'partTimeIncome',
            'transferIncome',
            'wageIncome',
            'otherIncome',
          ]}
        />
      </div>
    </>
  )
}
