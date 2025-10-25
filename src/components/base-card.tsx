import { type JSX } from 'react'
import {
  Card as UCard,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

interface Props {
  title?: string
  description?: string
  children: JSX.Element
}

export default function Card({ title, description, children }: Props) {
  return (
    <UCard className='gap-4 p-4 lg:p-6'>
      {title && (
        <CardHeader className='p-0'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent className='p-0'>{children}</CardContent>
    </UCard>
  )
}
