import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatNumber } from "@/lib/utils"
import { type TCurrency } from "@/lib/const"

interface ExtractColumn<T> {
  accessorKey: keyof T
  calcTotal: boolean
}
export type TColumns<T> = Array<Partial<ColumnDef<T>> & ExtractColumn<T>>

interface Props<T> {
  fixedColumnCount?: number
  data: T[]
  columns: TColumns<T>
}

export default function BaseTable<T>({ fixedColumnCount = -1, data, columns, }: Props<T>) {
  const divRef = React.useRef<HTMLDivElement>(null)
  const tableRowRef = React.useRef<HTMLTableRowElement>(null)
  const [isScroll, setIsScroll] = React.useState(false)
  const [scrollLeft, setScrollLeft] = React.useState(0)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  React.useEffect(() => {
    const [tableContainer] = divRef.current!.children

    tableContainer.addEventListener('scroll', ({ target }) => {
      if (target instanceof HTMLDivElement) {
        setScrollLeft(target.scrollLeft)
      }
    })

    setIsScroll(tableContainer.scrollWidth > tableContainer.clientWidth)
  }, [])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const getFixedColumnClassname = (index: number, defaultClassName = '') => {
    if (isScroll && fixedColumnCount > 0 && scrollLeft > 0 && fixedColumnCount -1 >= index) {
      const tableRowChildNodes = tableRowRef.current!.children
      const cls = new Array(fixedColumnCount).fill(`sticky bg-background ${defaultClassName}`)
      cls[fixedColumnCount - 1] = `${cls.at(-1)} after:w-[30px] after:h-full after:absolute after:top-0 after:right-[-30px] after:shadow-[inset_8px_0_6px_-6px_rgba(var(--shadow))]`
      return {
        className: cls[index],
        style: {
          left: index === 0 ? 0 : tableRowChildNodes[index - 1].clientWidth
        }
      }
    }
    return {
      className: defaultClassName
    }
  }

  const calcTotal = (column: (TColumns<T>)[number], handleRes = (r: number) => r) => {
    const { accessorKey, calcTotal } = column
    if (!calcTotal) {
      return '-'
    }
    const res = data.map(r => r[accessorKey] as number).reduce((a, b) => a + (b ?? 0), 0)
    return formatNumber(handleRes(res), (accessorKey as string).split('_')[1] as TCurrency['abbr'])
  }

  return (
    <div className="w-full rounded-md border" ref={divRef}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} ref={tableRowRef}>
              {headerGroup.headers.map((header, index) => {
                return (
                  <TableHead
                    key={header.id}
                    {...getFixedColumnClassname(index)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell key={cell.id} {...getFixedColumnClassname(index)}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
          <TableRow className="font-semibold">
            <TableCell { ...getFixedColumnClassname(0, 'bg-muted') }>合计</TableCell>
            <TableCell { ...getFixedColumnClassname(1, 'bg-muted') }>共{data.length}行</TableCell>
            {
              columns.slice(2).map((column) => <TableCell key={column.accessorKey as string} className="bg-muted">{calcTotal(column)}</TableCell>)
            }
          </TableRow>
          <TableRow className="font-semibold">
            <TableCell { ...getFixedColumnClassname(0, 'bg-muted') }>平均</TableCell>
            <TableCell { ...getFixedColumnClassname(1, 'bg-muted') }>%</TableCell>
            {
              columns.slice(2).map((column) => <TableCell key={column.accessorKey as string} className="bg-muted">{calcTotal(column, r => r / data.length)}</TableCell>)
            }
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
