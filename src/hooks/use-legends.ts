import { useState } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Legend = { key: string, label?: string, dataKey?: (row: any) => string | number, visible: boolean }

interface Props {
  id: string
  defaultLegends: Legend[]
}

export default function useLegends({ id, defaultLegends }: Props) {
  const cacheName = `${id}_chart_legend`
  const cache = JSON.parse(localStorage.getItem(cacheName) ?? '[]')

  const [legends, setLegends] = useState<Legend[]>(cache.length ? cache : defaultLegends)

  const onClickLegend = (key: string, visible: boolean) => {
    const d = [...legends]
    d.find((row: Legend) => row.key === key)!.visible = visible
    setLegends(d)
    localStorage.setItem(cacheName, JSON.stringify(d))
  }

  return { legends, onClickLegend }
}