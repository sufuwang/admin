import HK from './hk'

const Tables = [
  { label: '港股投资', comp: HK },
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

  return <div className='grid gap-12 grid-cols-1'>
    {renderTables()}
  </div>
}