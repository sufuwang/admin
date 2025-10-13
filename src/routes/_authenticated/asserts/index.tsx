import { createFileRoute } from '@tanstack/react-router'
import Asserts from '@/features/asserts'


export const Route = createFileRoute('/_authenticated/asserts/')({
  component: Asserts,
})
