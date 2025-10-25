import { OutcomeTableSum } from '@/data/asserts'
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
          description='2025年支出表中重要数据占比'
          data={OutcomeTableSum}
          dataKeys={[
            'bulkOutcome',
            'foodOutcome',
            'houseOutcome',
            'loans',
            'relativeOutcome',
            'specialOutcome',
            'transportOutcome',
            'otherOutcome',
          ]}
        />
      </div>
    </>
  )
}
