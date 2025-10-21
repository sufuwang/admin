import { useState } from "react"

export type Legend = { key: string, visible: boolean }

interface Props {
  id: string
  defaultLegends: Legend[]
}

export default function useLegends({ id, defaultLegends }: Props) {
  const cacheName = `${id}_chart_legend`
  const cache = JSON.parse(localStorage.getItem(cacheName) ?? '[]')

  const [legends, setLegends] = useState<Props['defaultLegends']>(cache.length ? cache : defaultLegends)

  const onClickLegend = (key: string, visible: boolean) => {
    const d = [...legends]
    d.find((row) => row.key === key)!.visible = visible
    setLegends(d)
    localStorage.setItem(cacheName, JSON.stringify(d))
  }

  return { legends, onClickLegend }
}