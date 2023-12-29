const cache = new Map<string, [number, number, number]>()

export const randomColor = (): [number, number, number] => {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)

  return [r, g, b]
}

export const edgeColor = (key: string): [number, number, number] => {
  if (cache.has(key)) return cache.get(key)!

  const color = randomColor()
  cache.set(key, color)

  return color
}
