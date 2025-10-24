import { useState, useRef, useLayoutEffect, type JSX } from 'react'
import {
  TShareRowStatus,
  type TShareRowKeys,
  type TShareRow,
  type TShareSum,
} from '@/data/stock'
import { TrendingUp, TrendingDown, LoaderCircle, Check } from 'lucide-react'
import { ColumnKeys, getColumnAlias, type TCurrency } from '@/lib/const'
import { cn, formatNumber } from '@/lib/utils'
import {
  Table as RTable,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Render = (r: any, row?: TShareRow) => string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RenderX<T> = (r: any, index: number) => T
interface Props {
  shares: TShareRow[]
  sharesSum: TShareSum
  currency: TCurrency['abbr']
}

export default function Table({ shares, sharesSum, currency }: Props) {
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

  const renderNumber = (r: number) => {
    if (!r) {
      return '-'
    }
    return formatNumber(r, currency)
  }
  const renderStatus: Render = (r, row) => {
    if (r === TShareRowStatus.PROFIT) {
      return <TrendingUp className='w-4 text-red-500' />
    } else if (r === TShareRowStatus.LOSS) {
      return <TrendingDown className='w-4 text-green-500' />
    } else if (r === TShareRowStatus.BUYING && row) {
      const ds = shares
        .filter((item) => item.code === row.code)
        .filter((item) => item.status !== TShareRowStatus.BUYING)
      return ds.length ? (
        <Check className='w-4' />
      ) : (
        <LoaderCircle className='w-4 animate-spin text-blue-400 duration-1000' />
      )
    }
    return r
  }
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
      key: 'status',
      render: renderStatus,
    },
    {
      key: 'date',
      render: (r) => (Array.isArray(r) ? r.join(' - ') : r),
    },
    {
      key: 'days',
      render: (r) => (r === 0 ? 'T' : r || '-'),
    },
    {
      key: 'amount',
    },
    {
      key: 'costPrice',
      render: renderNumber,
    },
    {
      key: 'sellPrice',
      render: renderNumber,
    },
    {
      key: 'serviceFee',
      render: renderNumber,
    },
    {
      key: 'earning',
      render: renderNumber,
    },
    {
      key: 'earningRate',
      render: (r) => (r ? `${r}%` : '-'),
    },
  ]

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
      <RTable>
        <TableHeader>
          <TableRow ref={tableRowRef}>
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
          {shares.map((row, i) => (
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
            <TableCell {...getFixedColumnClassname(0, 'bg-muted')}>总和</TableCell>
            <TableCell key='status' {...getFixedColumnClassname(1, 'bg-muted')}>
              {renderStatus(
                sharesSum.earning > 0
                  ? TShareRowStatus.PROFIT
                  : TShareRowStatus.LOSS
              )}
            </TableCell>
            <TableCell>共{shares.length}行</TableCell>
            <TableCell key='days'>-</TableCell>
            <TableCell key='amount'>-</TableCell>
            <TableCell key='costPrice'>
              {formatNumber(sharesSum.cost, currency)}
            </TableCell>
            <TableCell key='sellPrice'>-</TableCell>
            <TableCell key='serviceFee'>
              {formatNumber(sharesSum.serviceFee, currency)}
            </TableCell>
            <TableCell key='earning'>
              {formatNumber(sharesSum.earning, currency)}
            </TableCell>
            <TableCell key='earningRate'>
              {sharesSum.earningRate + '%'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell {...getFixedColumnClassname(0, 'bg-muted')}>平均</TableCell>
            <TableCell key='status' {...getFixedColumnClassname(1, 'bg-muted')}>
              {renderStatus(
                sharesSum.earning > 0
                  ? TShareRowStatus.PROFIT
                  : TShareRowStatus.LOSS
              )}
            </TableCell>
            {columns.slice(1, -3).map((column) => (
              <TableCell key={column.key}>-</TableCell>
            ))}
            <TableCell key='earning'>
              {formatNumber(sharesSum.earning / shares.length, currency)}
            </TableCell>
            <TableCell key='earningRate'>
              {(sharesSum.earningRate / shares.length).toFixed(2) + '%'}
            </TableCell>
          </TableRow>
        </TableFooter>
      </RTable>
    </div>
  )
}
