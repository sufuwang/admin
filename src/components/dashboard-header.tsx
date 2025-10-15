import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'

export default function DashboardHeader() {
  return <Header>
    <div className='ms-auto flex items-center space-x-4'>
      <ThemeSwitch />
    </div>
  </Header>
}