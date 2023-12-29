import { data } from './data'
import { graph } from './visualization'
import { findAllRoutes } from './visualization/route'
import { initializeState } from './visualization/state'

initializeState()

for (const node of data.nodes) {
  graph.addNode(node.key, node.attributes)
}

for (const edge of data.edges) {
  graph.addDirectedEdgeWithKey(edge.key, edge.source, edge.target, edge.attributes)
}

function handleFormSubmit(e: Event) {
  e.preventDefault()

  const formData = new FormData(e.target as HTMLFormElement)
  const from = formData.get('from') as string
  const to = formData.get('to') as string
  const maxDepth = formData.get('max-depth') as string

  if (!from || !to || from === to || from.length !== 3 || to.length !== 3) {
    alert('Invalid input')
    return
  }

  findAllRoutes(from, to, maxDepth ? +maxDepth : undefined)
}

document.getElementById('search')?.addEventListener('submit', handleFormSubmit)
