import { useState, useRef, useLayoutEffect } from 'react'
import {
  ResumeTableData,
  ResumeTableSum,
  type TResumeTableRow,
  type TResumeTableRowSum,
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
const columns: { key: keyof TResumeTableRow; render?: (r: any) => string }[] = [
  {
    key: 'company',
  },
  {
    key: 'date',
    render: (r) => r.join(' - '),
  },
  {
    key: 'month',
  },
  {
    key: 'pretaxIncome',
    render: formatNumber,
  },
  {
    key: 'singleAccumulationFund',
    render: formatNumber,
  },
  {
    key: 'medicalInsurance',
    render: formatNumber,
  },
  {
    key: 'oldAgeInsurance',
    render: formatNumber,
  },
  {
    key: 'unemploymentInsurance',
    render: formatNumber,
  },
  {
    key: 'averageMonthlyIncome',
    render: formatNumber,
  },
]
const calcTotal = (key: keyof TResumeTableRow) => {
  return ResumeTableData.map((r) => r[key] as number).reduce(
    (a, b) => a + (b ?? 0),
    0
  )
}

export default function ResumeTable() {
  const divRef = useRef<HTMLTableRowElement>(null)
  const [scrollLeft, setScrollLeft] = useState<number>(0)

  useLayoutEffect(() => {
    if (divRef.current) {
      const [div] = divRef.current!.childNodes
      div.addEventListener('scroll', ({ target }) => {
        if (target instanceof HTMLDivElement) {
          setScrollLeft(target.scrollLeft)
        }
      })
    }
  }, [])

  const getFixedColumnClassname = (index: number, defaultClassName = '') => {
    if (scrollLeft === 0 || index > 0) {
      return {}
    }
    return {
      className: cn(
        'sticky bg-background after:w-[30px] after:h-full after:absolute after:top-0 after:right-[-30px] after:shadow-[inset_8px_0_6px_-6px_rgba(var(--shadow))]',
        defaultClassName
      ),
      style: { left: 0 },
    }
  }

  return (
    <div className='w-full overflow-hidden rounded-md border' ref={divRef}>
      <Table>
        <TableHeader>
          <TableRow>
            {Object.keys(ResumeTableData[0]).map((accessorKey, index) => (
              <TableHead key={accessorKey} {...getFixedColumnClassname(index)}>
                {ColumnKeys[accessorKey as keyof typeof ColumnKeys] ||
                  getColumnAlias(accessorKey) ||
                  accessorKey}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ResumeTableData.map((row, i) => (
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
            <TableCell {...getFixedColumnClassname(0, 'bg-[#F8FAFB]')}>
              总和
            </TableCell>
            <TableCell>共{ResumeTableData.length}家公司</TableCell>
            <TableCell>{calcTotal('month')}</TableCell>
            {columns.slice(3).map((col) => (
              <TableCell key={col.key}>
                {formatNumber(
                  ResumeTableSum[col.key as keyof TResumeTableRowSum]
                )}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell {...getFixedColumnClassname(0, 'bg-[#F8FAFB]')}>
              平均
            </TableCell>
            <TableCell>-</TableCell>
            <TableCell>
              {(calcTotal('month') / ResumeTableData.length).toFixed(2)}
            </TableCell>
            {columns.slice(3).map((col) => (
              <TableCell key={col.key}>
                {formatNumber(calcTotal(col.key) / ResumeTableData.length)}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
