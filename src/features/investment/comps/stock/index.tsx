import Table from './table'
import { AShares, ASharesSum, HKShares, HKSharesSum, USShares, USSharesSum } from '@/data/stock'

const Tables = [
  { label: '港股交易', Comp: <Table currency='HKD' shares={HKShares} sharesSum={HKSharesSum} /> },
  { label: '美股交易', Comp: <Table currency='USD' shares={USShares} sharesSum={USSharesSum} /> },
  { label: 'A股交易', Comp: <Table currency='CNY' shares={AShares} sharesSum={ASharesSum} /> },
]

export default function Stock() {

  const renderTables = () => {
    return Tables.map(({ label, Comp }) => <div key={label}>
        <div className="scroll-m-20 text-xl lg:text-2xl font-semibold tracking-tight mb-2 ml-2">
          {label}
        </div>
        {Comp}
      </div>
    )
  }

  return <div className='grid gap-6 lg:gap-12 grid-cols-1'>
    {renderTables()}
  </div>
}