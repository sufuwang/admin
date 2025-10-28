import { cn } from '@/lib/utils'

export function Logo({ className }: { className: string }) {
  return <img src="/images/favicon.jpg" className={cn('size-6', className)} />
}
