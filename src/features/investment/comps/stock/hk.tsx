import { useState, useRef, useLayoutEffect, type JSX } from 'react'
import { HKShares, HKSharesSum, type TShareRowKeys, type TShareRow } from '@/data/stock'
import { TrendingUp, TrendingDown, LoaderCircle, Check } from 'lucide-react'
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
type Render = (r: any, row: TShareRow) => string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RenderX<T> = (r: any, index: number) => T

const columns: {
  key: TShareRowKeys
  label?: string
  render?: Render
  renderHead?: RenderX<JSX.Element[]>
  renderCell?: RenderX<JSX.Element>
}[] = [
  {
    key: 'share',
  },
  {
    key: 'date',
    render: (r) => (Array.isArray(r) ? r.join(' -> ') : r),
  },
  {
    key: 'days',
    render: (r) => (r === 0 ? 'T' : r),
  },
  {
    key: 'amount',
  },
  {
    key: 'costPrice',
    render: (r) => formatNumber(r, 'HKD'),
  },
  {
    key: 'sellPrice',
    render: (r) => formatNumber(r, 'HKD'),
  },
  {
    key: 'serviceFee',
    render: (r) => formatNumber(r, 'HKD'),
  },
  {
    key: 'earning',
    render: (r) => formatNumber(r, 'HKD'),
  },
  {
    key: 'earningRate',
  },
  {
    key: 'status',
    render: (r, row) => {
      if (r === 'PROFIT') {
        return <TrendingUp className='w-4 text-red-500' />
      } else if (r === 'LOSS') {
        return <TrendingDown className='w-4 text-green-500' />
      } else if (r === 'BUYING') {
        const ds = HKShares.filter((item) => item.code === row.code).filter(
          (item) => item.status !== 'BUYING'
        )
        return ds.length ? (
          <Check className='w-4' />
        ) : (
          <LoaderCircle className='w-4 animate-spin text-blue-400 duration-1000' />
        )
      }
      return r
    },
  },
]

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
            {columns.map(({ key, label }, index) => {
              return (
                <TableHead key={key} {...getFixedColumnClassname(index)}>
                  {label ||
                    ColumnKeys[key as keyof typeof ColumnKeys] ||
                    getColumnAlias(key) ||
                    key}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {HKShares.map((row, i) => (
            <TableRow key={i}>
              {columns.map((col, index) => {
                if (col.renderCell) {
                  return col.renderCell(row[col.key], index)
                }

                return (
                  <TableCell key={col.key} {...getFixedColumnClassname(index)}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : ((row[col.key] === undefined
                          ? '-'
                          : row[col.key]) as string)}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell {...getFixedColumnClassname(0, 'bg-muted')}>
              总和
            </TableCell>
            <TableCell>
              共{HKShares.length}行
            </TableCell>
            <TableCell key='days'>-</TableCell>
            <TableCell key='amount'>-</TableCell>
            <TableCell key='costPrice'>{formatNumber(HKSharesSum.cost, 'HKD')}</TableCell>
            <TableCell key='sellPrice'>-</TableCell>
            <TableCell key='serviceFee'>{formatNumber(HKSharesSum.serviceFee, 'HKD')}</TableCell>
            <TableCell key='earning'>{formatNumber(HKSharesSum.earning, 'HKD')}</TableCell>
            <TableCell key='earningRate'>{HKSharesSum.earningRate + '%'}</TableCell>
            {columns.slice(-1).map((col) => (
              <TableCell key={col.key}>-</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell {...getFixedColumnClassname(0, 'bg-muted')}>
              平均
            </TableCell>
            {columns.slice(1, -3).map((column) => (
              <TableCell key={column.key}>-</TableCell>
            ))}
            <TableCell key='earning'>{formatNumber(HKSharesSum.earning / HKShares.length, 'HKD')}</TableCell>
            <TableCell key='earningRate'>{(HKSharesSum.earningRate / HKShares.length).toFixed(2) + '%'}</TableCell>
            {columns.slice(-1).map((col) => (
              <TableCell key={col.key}>-</TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
