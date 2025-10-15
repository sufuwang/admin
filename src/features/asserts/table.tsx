import {
  type TBalanceTableRow,
  type TIncomeTableRow,
  type TOutcomeTableRow,
} from '@/data/asserts'
import { ColumnKeys, getColumnAlias, type TCurrency } from '@/lib/const'
import { formatNumber } from '@/lib/utils'
import Table, { type TColumns } from '@/components/base-table'

function renderTable<
  T extends TBalanceTableRow | TIncomeTableRow | TOutcomeTableRow,
>(TableData: T[]) {
  // 处理表格数据
  const data = TableData
    .map((row) => {
      const data: Record<string, unknown> = {}
      Object.keys(row).forEach((key) => {
        if (key === 'balances') {
          ;(row as TBalanceTableRow)['balances']?.forEach((balance) => {
            data[`balance_${balance.abbr}`] = balance.value
            data[`balance_${balance.abbr}_MoM`] = balance.MoM
            data[`balance_${balance.abbr}_YoY`] = balance.YoY
          })
        } else if (
          key === 'loans' &&
          Array.isArray((row as TBalanceTableRow)['loans'])
        ) {
          ;((row as TBalanceTableRow)['loans'] ?? []).forEach((loan) => {
            data[loan.header] = loan.value
          })
        } else {
          data[key] = row[key as keyof T]
        }
      })
      return data
    })
  if (data.length === 0) {
    return <div>No data</div>
  }
  // 处理头部
  const _d = (data as TBalanceTableRow[]).reduce(
    (prev: TBalanceTableRow, curr) => {
      const d = { ...prev, ...curr }
      if ((curr.balances ?? []).length > (prev.balances ?? []).length) {
        d.balances = curr.balances
      }
      if ((curr.loans ?? []).length > (prev.loans ?? []).length) {
        d.loans = curr.loans
      }
      return d
    },
    data[0] as TBalanceTableRow
  )
  const columns: TColumns<(typeof data)[number]> = Object.keys(_d)
    .reduce((arr, cur) => {
      if (arr.at(-1) === 'comment') {
        return [...arr.slice(0, -1), cur, 'comment']
      }
      return [...arr, cur]
    }, [] as string[])
    .map(
      (accessorKey) => ({
        accessorKey,
        header:
          ColumnKeys[accessorKey as keyof typeof ColumnKeys] ||
          getColumnAlias(accessorKey) ||
          accessorKey,
        cell: ({ row }) => {
          if (
            accessorKey.endsWith('Income') ||
            accessorKey.endsWith('Outcome') ||
            accessorKey.startsWith('balance_') ||
            accessorKey.startsWith('total') ||
            ['剩余房贷', '房贷还款'].includes(accessorKey)
          ) {
            return formatNumber(row.getValue(accessorKey), accessorKey.split('_')[1] as TCurrency['abbr'])
          }
          return row.getValue(accessorKey) ?? '-'
        },
        calcTotal: !['year', 'month', 'comment'].includes(accessorKey) && !accessorKey.startsWith('balance_'),
      })
    )
  return <Table data={data} columns={columns} />
}

interface Props {
  data: (TBalanceTableRow | TIncomeTableRow | TOutcomeTableRow)[]
}
export function BalanceTable({ data }: Props) {
  return renderTable(data)
}
export function IncomeTable({ data }: Props) {
  return renderTable(data)
}
export function OutcomeTable({ data }: Props) {
  return renderTable(data)
}
