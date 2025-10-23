import HK from './hk'
import US from './us'

const Tables = [
  { label: '港股交易', comp: HK },
  { label: '美股交易', comp: US },
]

export default function Stock() {

  const renderTables = () => {
    return Tables.map(({ label, comp }) => <div key={label}>
        <div className="scroll-m-20 text-xl lg:text-2xl font-semibold tracking-tight mb-2">
          {label}
        </div>
        {comp()}
      </div>
    )
  }

  return <div className='grid gap-6 lg:gap-12 grid-cols-1'>
    {renderTables()}
  </div>
}