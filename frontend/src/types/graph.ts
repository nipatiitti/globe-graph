export type Node = {
  label: string
  x: number
  y: number
  size: number
  color: string
}

export type Edge = {
  label: string
  size: number
  lowcost: boolean
  color: string
  from_position: [number, number]
  to_position: [number, number]
  freq: number
}
