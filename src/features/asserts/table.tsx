import Table from '@/components/base-table'
import {
  BalanceTable as BalanceTableData,
  IncomeTable as IncomeTableData,
  OutcomeTable as OutcomeTableData,
  type TBalanceTableRow,
  type TIncomeTableRow,
  type TOutcomeTableRow
} from '@/data/asserts'
import { type ColumnDef } from "@tanstack/react-table"
import { ColumnKeys, getColumnAlias } from '@/lib/const'

function renderTable<T extends (TBalanceTableRow | TIncomeTableRow | TOutcomeTableRow)>(TableData: T[], year: number) {
  const data = TableData.filter(row => row.year === year).map((row) => {
    const data: Record<string, unknown> = {}
    Object.keys(row).forEach((key) => {
      if (key === 'balances') {
        (row as TBalanceTableRow)['balances'].forEach((balance) => {
          data[`balance_${balance.abbr}`] = balance.value
          data[`balance_${balance.abbr}_MoM`] = balance.MoM
          data[`balance_${balance.abbr}_YoY`] = balance.YoY
        })
      } else if (key === 'loans' && Array.isArray((row as TBalanceTableRow)['loans'])) {
        ((row as TBalanceTableRow)['loans'] ?? []).forEach((loan) => {
          data[loan.header] = loan.value
        })
      } else {
        data[key] = row[key as keyof T]
      }
    })
    return data
  })
  if (data.length === 0) {
    return <div>No data for {year}</div>
  }
  const columns: ColumnDef<typeof data[number]>[] = Object.keys(data[0]).map(accessorKey => ({
    accessorKey,
    header: ColumnKeys[accessorKey as keyof typeof ColumnKeys] || getColumnAlias(accessorKey) || accessorKey,
    cell: ({ row }) => row.getValue(accessorKey) ?? '-',
  }))
  return <Table data={data} columns={columns} />
}

interface Props {
  year: number
}
export function BalanceTable({ year }: Props) {
  return renderTable(BalanceTableData, year)
}
export function IncomeTable({ year }: Props) {
  return renderTable(IncomeTableData, year)
}
export function OutcomeTable({ year }: Props) {
  return renderTable(OutcomeTableData, year)
}