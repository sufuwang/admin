import { useState, useRef, useLayoutEffect } from 'react'
import {
  IncomeTableData,
  IncomeTableSum,
  type TIncomeTableRow,
  type TIncomeTableSum,
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
const columns: { key: keyof TIncomeTableRow; render?: (r: any) => string }[] = [
  {
    key: 'year',
  },
  {
    key: 'month',
    render: (r) => r.slice(0, 3),
  },
  {
    key: 'wageIncome',
    render: formatNumber,
  },
  {
    key: 'fundIncome',
    render: formatNumber,
  },
  {
    key: 'partTimeIncome',
    render: formatNumber,
  },
  {
    key: 'investmentIncome',
    render: formatNumber,
  },
  {
    key: 'otherIncome',
    render: formatNumber,
  },
  {
    key: 'totalPureIncome',
    render: formatNumber,
  },
  {
    key: 'transferIncome',
    render: formatNumber,
  },
  {
    key: 'totalIncome',
    render: formatNumber,
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
      setHeadersWidth(Array.from(tableRowRef.current.children).map(
        (child) => child.clientWidth
      ))
    }
  }, [])

  const getFixedColumnClassname = (index: number, defaultClassName = '') => {
    if (scrollLeft === 0 || index > 1) {
      return {}
    }
    if (index === 0) {
      return {
        className: cn(
          'sticky bg-background',
          defaultClassName
        ),
        style: { left: 0 },
      }
    } else if (index === 1) {
      return {
        className: cn(
          'sticky bg-background after:w-[30px] after:h-full after:absolute after:top-0 after:right-[-30px] after:shadow-[inset_8px_0_6px_-6px_rgba(var(--shadow))]',
          defaultClassName
        ),
        style: { left: headersWidth[0] || 0},
      }
    }
  }

  return (
    <div className='w-full overflow-hidden rounded-md border' ref={divRef}>
      <Table>
        <TableHeader>
          <TableRow ref={tableRowRef}>
            {columns.map(({ key }, index) => (
              <TableHead key={key} {...getFixedColumnClassname(index)}>
                {ColumnKeys[key as keyof typeof ColumnKeys] ||
                  getColumnAlias(key) ||
                  key}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {IncomeTableData.map((row, i) => (
            <TableRow key={i}>
              {columns.map((col, index) => (
                <TableCell key={col.key} {...getFixedColumnClassname(index)}>
                  {col.render ? col.render(row[col.key]) : row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell {...getFixedColumnClassname(0, 'bg-muted')}>总和</TableCell>
            <TableCell {...getFixedColumnClassname(1, 'bg-muted')}>共{IncomeTableData.length}行</TableCell>
            {columns.slice(2, -1).map((col) => (
              <TableCell key={col.key}>
                {formatNumber(
                  IncomeTableSum[col.key as keyof TIncomeTableSum]
                )}
              </TableCell>
            ))}
            <TableCell>-</TableCell>
          </TableRow>
          <TableRow>
            <TableCell {...getFixedColumnClassname(0, 'bg-muted')}>平均</TableCell>
            <TableCell {...getFixedColumnClassname(1, 'bg-muted')}>-</TableCell>
            {columns.slice(2, -1).map((col) => (
              <TableCell key={col.key}>
                {formatNumber(IncomeTableSum[col.key as keyof TIncomeTableSum] / IncomeTableData.length)}
              </TableCell>
            ))}
            <TableCell>-</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
