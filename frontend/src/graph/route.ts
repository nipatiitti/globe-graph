import { graph, renderer } from '.'
import { allSimpleEdgePaths } from './simple-path'

export const findAllRoutes = (from: string, to: string, maxDepth: number = 3) => {
  console.time('findAllRoutes')
  const paths = allSimpleEdgePaths(graph, from, to, { maxDepth })
  const flattenAndRemoveDuplicates = (arr: Array<Array<string>>) => {
    return Array.from(new Set(arr.flat(2)))
  }
  window.state.routes = flattenAndRemoveDuplicates(paths)
  console.timeEnd('findAllRoutes')
  renderer.refresh()
}
