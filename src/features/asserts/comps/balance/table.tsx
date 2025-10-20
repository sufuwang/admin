import { useState, useRef, useLayoutEffect, type JSX } from 'react'
import {
  BalanceTableData,
  BalanceTableSum,
  type TBalanceTableRow,
  type TBalanceTableSum,
} from '@/data/asserts'
import { ColumnKeys, getColumnAlias } from '@/lib/const'
import { cn, formatNumber } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Render = (r: any) => string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RenderX<T> = (r: any, index: number) => T

const columns: {key: keyof TBalanceTableRow, label?: string, render?: Render, renderHead?: RenderX<JSX.Element[]>, renderCell?: RenderX<JSX.Element>}[] = [
  {
    key: 'year',
  },
  {
    key: 'month',
    render: (r) => r.slice(0, 3),
  },
  {
    key: 'totalIncome',
    render: formatNumber,
  },
  {
    key: 'totalOutcome',
    render: formatNumber,
  },
  {
    key: 'balances',
    renderHead: (row: TBalanceTableRow['balances'], index: number) => {
      return row!.map((item, i) => <>
        <TableHead key={`${index}_${item.abbr}_${i}_value`}>{getColumnAlias(`balances_${item.abbr}`)}</TableHead>
        <TableHead key={`${index}_${item.abbr}_${i}_MoM`}>{getColumnAlias(`balances_${item.abbr}_MoM`)}</TableHead>
        <TableHead key={`${index}_${item.abbr}_${i}_YoY`}>{getColumnAlias(`balances_${item.abbr}_YoY`)}</TableHead>
      </>)
    },
    renderCell: (row: TBalanceTableRow['balances'] = [], index: number) => {
      const cny = row.find(d => d?.abbr === 'CNY') ?? {abbr: 'CNY', value: 0, MoM: 0, YoY: 0}
      const hkd = row.find(d => d?.abbr === 'HKD') ?? {abbr: 'HKD', value: 0, MoM: 0, YoY: 0}
      return <>
        <TableCell key={`${index}_CNY_value`}>{formatNumber(cny.value)}</TableCell>
        <TableCell key={`${index}_CNY_MoM`}>{formatNumber(cny.MoM)}</TableCell>
        <TableCell key={`${index}_CNY_YoY`}>{formatNumber(cny.YoY)}</TableCell>
        <TableCell key={`${index}_HKD_value`}>{formatNumber(hkd.value, 'HKD')}</TableCell>
        <TableCell key={`${index}_HKD_MoM`}>{formatNumber(hkd.MoM, 'HKD')}</TableCell>
        <TableCell key={`${index}_HKD_YoY`}>{formatNumber(hkd.YoY, 'HKD')}</TableCell>
      </>
    }
  },
  {
    key: 'loans',
    label: '房贷待还',
    render: (r) => formatNumber(r && r[0] ? r[0].value : 0),
  },
  {
    key: 'comment',
  },
]

export default function ResumeTable() {
  const divRef = useRef<HTMLTableRowElement>(null)
  const tableRowRef = useRef<HTMLTableRowElement>(null)
  const [scrollLeft, setScrollLeft] = useState<number>(0)
  const [headersWidth, setHeadersWidth] = useState<number[]>([])

  useLayoutEffect(() => {
    if (divRef.current) {
      const [div] = divRef.current!.childNodes
      div.addEventListener('scroll', ({ target }) => {
        if (target instanceof HTMLDivElement) {
          setScrollLeft(target.scrollLeft)
        }
      })
    }
    if (tableRowRef.current) {
      setHeadersWidth(
        Array.from(tableRowRef.current.children).map(
          (child) => child.clientWidth
        )
      )
    }
  }, [])

  const getFixedColumnClassname = (index: number, defaultClassName = '') => {
    if (scrollLeft === 0 || index > 1) {
      return {}
    }
    if (index === 0) {
      return {
        className: cn('sticky bg-background', defaultClassName),
        style: { left: 0 },
      }
    } else if (index === 1) {
      return {
        className: cn(
          'sticky bg-background after:w-[30px] after:h-full after:absolute after:top-0 after:right-[-30px] after:shadow-[inset_8px_0_6px_-6px_rgba(var(--shadow))]',
          defaultClassName
        ),
        style: { left: headersWidth[0] || 0 },
      }
    }
  }

  return (
    <div className='w-full overflow-hidden rounded-md border' ref={divRef}>
      <Table>
        <TableHeader>
          <TableRow ref={tableRowRef}>
            {columns.map(({ key, label, renderHead }, index) => {
              if (renderHead) {
                const rows = BalanceTableData.map(row => row[key]).flat(Infinity) as NonNullable<TBalanceTableRow['balances']>
                return renderHead([...new Set(rows.map(row => row.abbr))].map((abbr) => ({ abbr, value: 0, MoM: 0, YoY: 0 })), index)
              }
              return <TableHead key={key} {...getFixedColumnClassname(index)}>
                {label ||
                  ColumnKeys[key as keyof typeof ColumnKeys] ||
                  getColumnAlias(key) ||
                  key}
              </TableHead>
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {BalanceTableData.map((row, i) => (
            <TableRow key={i}>
              {columns.map((col, index) => {
                if (col.renderCell) {
                  return col.renderCell(row[col.key], index)
                }
                return <TableCell key={col.key} {...getFixedColumnClassname(index)}>
                    {col.render
                      ? col.render(row[col.key])
                      : ((row[col.key] || '-') as string)}
                  </TableCell>
                })}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell {...getFixedColumnClassname(0, 'bg-muted')}>
              总和
            </TableCell>
            <TableCell {...getFixedColumnClassname(1, 'bg-muted')}>
              共{BalanceTableData.length}行
            </TableCell>
            {columns.slice(2, 4).map((col) => (
              <TableCell key={col.key}>
                {formatNumber(
                  BalanceTableSum[col.key as keyof TBalanceTableSum]
                )}
              </TableCell>
            ))}
            {new Array(8).fill(1).map((column) => (
              <TableCell key={column.key}>-</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell {...getFixedColumnClassname(0, 'bg-muted')}>
              平均
            </TableCell>
            <TableCell {...getFixedColumnClassname(1, 'bg-muted')}>-</TableCell>
            {columns.slice(2, 4).map((col) => (
              <TableCell key={col.key}>
                {formatNumber(
                  BalanceTableSum[col.key as keyof TBalanceTableSum] /
                    BalanceTableData.length
                )}
              </TableCell>
            ))}
            {new Array(8).fill(1).map((column) => (
              <TableCell key={column.key}>-</TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
