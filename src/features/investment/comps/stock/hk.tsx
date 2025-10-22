// import { useState, useRef, useLayoutEffect, type JSX } from 'react'
// import { ColumnKeys, getColumnAlias } from '@/lib/const'
// import { cn, formatNumber } from '@/lib/utils'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import { AShares, type TShareRowKeys } from '@/data/stock'

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type Render = (r: any) => string
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type RenderX<T> = (r: any, index: number) => T

// const columns: {key: TShareRowKeys, label?: string, render?: Render, renderHead?: RenderX<JSX.Element[]>, renderCell?: RenderX<JSX.Element>}[] = [
//   {
//     key: 'name',
//   },
//   {
//     key: 'date',
//   },
//   {
//     key: 'days',
//   },
//   {
//     key: 'amount',
//   },
//   {
//     key: 'costPrice',
//   },
//   {
//     key: 'sellPrice',
//   },
//   {
//     key: 'serviceFee',
//   },
//   {
//     key: 'earning',
//   },
//   {
//     key: 'earningRate',
//   },
//   {
//     key: 'status',
//   },
// ]

// export default function ResumeTable() {
//   const divRef = useRef<HTMLTableRowElement>(null)
//   const tableRowRef = useRef<HTMLTableRowElement>(null)
//   const [scrollLeft, setScrollLeft] = useState<number>(0)
//   const [headersWidth, setHeadersWidth] = useState<number[]>([])

//   useLayoutEffect(() => {
//     console.info('AShares: ', AShares)

//     if (divRef.current) {
//       const [div] = divRef.current!.childNodes
//       div.addEventListener('scroll', ({ target }) => {
//         if (target instanceof HTMLDivElement) {
//           setScrollLeft(target.scrollLeft)
//         }
//       })
//     }
//     if (tableRowRef.current) {
//       setHeadersWidth(
//         Array.from(tableRowRef.current.children).map(
//           (child) => child.clientWidth
//         )
//       )
//     }
//   }, [])

//   const getFixedColumnClassname = (index: number, defaultClassName = '') => {
//     if (scrollLeft === 0 || index > 1) {
//       return {}
//     }
//     if (index === 0) {
//       return {
//         className: cn('sticky bg-background', defaultClassName),
//         style: { left: 0 },
//       }
//     } else if (index === 1) {
//       return {
//         className: cn(
//           'sticky bg-background after:w-[30px] after:h-full after:absolute after:top-0 after:right-[-30px] after:shadow-[inset_8px_0_6px_-6px_rgba(var(--shadow))]',
//           defaultClassName
//         ),
//         style: { left: headersWidth[0] || 0 },
//       }
//     }
//   }

//   return (
//     <div className='w-full overflow-hidden rounded-md border' ref={divRef}>
//       <Table>
//         <TableHeader>
//           <TableRow ref={tableRowRef}>
//             {columns.map(({ key, label }, index) => {
//               return <TableHead key={key} {...getFixedColumnClassname(index)}>
//                 {label ||
//                   ColumnKeys[key as keyof typeof ColumnKeys] ||
//                   getColumnAlias(key) ||
//                   key}
//               </TableHead>
//             })}
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {AShares.map((row, i) => (
//             <TableRow key={i}>
//               {columns.map((col, index) => {
//                 // if (col.renderCell) {
//                 //   return col.renderCell(row[col.key], index)
//                 // }

//                 const s = row[col.key]

//                 return <TableCell key={col.key} {...getFixedColumnClassname(index)}>
//                     {col.render
//                       ? col.render(row[col.key])
//                       : ((row[col.key] || '-') as string)}
//                   </TableCell>
//                 })}
//             </TableRow>
//           ))}
//         </TableBody>
//         {/* <TableFooter>
//           <TableRow>
//             <TableCell {...getFixedColumnClassname(0, 'bg-muted')}>
//               总和
//             </TableCell>
//             <TableCell {...getFixedColumnClassname(1, 'bg-muted')}>
//               共{AShares.length}行
//             </TableCell>
//             {columns.slice(2, 4).map((col) => (
//               <TableCell key={col.key}>
//                 {formatNumber(
//                   AShares[col.key as keyof TShareRow]
//                 )}
//               </TableCell>
//             ))}
//             {new Array(8).fill(1).map((column) => (
//               <TableCell key={column.key}>-</TableCell>
//             ))}
//           </TableRow>
//           <TableRow>
//             <TableCell {...getFixedColumnClassname(0, 'bg-muted')}>
//               平均
//             </TableCell>
//             <TableCell {...getFixedColumnClassname(1, 'bg-muted')}>-</TableCell>
//             {columns.slice(2, 4).map((col) => (
//               <TableCell key={col.key}>
//                 {formatNumber(
//                   BalanceTableSum[col.key as keyof TBalanceTableSum] /
//                     BalanceTableData.length
//                 )}
//               </TableCell>
//             ))}
//             {new Array(8).fill(1).map((column) => (
//               <TableCell key={column.key}>-</TableCell>
//             ))}
//           </TableRow>
//         </TableFooter> */}
//       </Table>
//     </div>
//   )
// }
