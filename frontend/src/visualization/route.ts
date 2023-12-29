import { graph, render } from '.'
import { allSimpleEdgePaths } from './simple-path'
import { setState } from './state'

export const findAllRoutes = (from: string, to: string, maxDepth: number = 3) => {
  console.time('findAllRoutes')
  const paths = allSimpleEdgePaths(graph, from, to, { maxDepth })

  setState({
    highlightedRoutes: new Set(paths.flat(2))
  })
  render()
  console.timeEnd('findAllRoutes')
}
