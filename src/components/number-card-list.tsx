import { isMobile } from '@/lib/utils'
import { Card, CardTitle, CardHeader, CardContent } from './ui/card'
import { Empty } from './ui/empty'

export interface NumberCardItem {
  title: string
  value: string
  description?: string
  icon?: React.ReactNode
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
        {props.data.icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{props.data.value}</div>
        {props.data.description && !isMobile() && (
          <p className='text-muted-foreground text-xs' dangerouslySetInnerHTML={{ __html: props.data.description.replace(/\n/g, '<br/>') }} />
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
