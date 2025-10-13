import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  onChange: (year: number) => void
}

const Years = ['2025']
export const defaultYear = Years[0]

export default function YearPicker({ onChange }: Props) {
  return <Select defaultValue={defaultYear} onValueChange={(d) => onChange(+d)}>
    <SelectTrigger>
      <SelectValue placeholder="YYYY" />
    </SelectTrigger>
    <SelectContent>
      { Years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>) }
    </SelectContent>
  </Select>
}
