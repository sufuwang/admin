import { isMobile } from '@/lib/utils'
import { Card, CardTitle, CardHeader, CardContent } from './ui/card'
import { Empty } from './ui/empty'

export interface NumberCardItem {
  title: string
  icon?: React.ReactNode
  value: string
  description: string
}
export interface NumberCardItemProps {
  data: NumberCardItem
}
export interface NumberCardListProps {
  data: NumberCardItem[]
}

const NumberCardItem = (props: NumberCardItemProps) => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>
          {props.data.title}
        </CardTitle>
        {props.data.icon ? (
          props.data.icon
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='text-muted-foreground h-4 w-4'
          >
            <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
          </svg>
        )}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{props.data.value}</div>
        {!isMobile() && (
          <p className='text-muted-foreground text-xs'>
            +20.1% from last month
            {props.data.description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default function NumberCardList(props: NumberCardListProps) {
  if (props.data && props.data.length > 0) {
    return (
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
        {props.data.map((data, index) => (
          <NumberCardItem key={index} data={data} />
        ))}
      </div>
    )
  }
  return <Empty />
}
