import { createFileRoute } from '@tanstack/react-router'
import Investment from '@/features/investment'

export const Route = createFileRoute('/_authenticated/investment/')({
  component: Investment,
})
