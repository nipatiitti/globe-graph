import { SerializedGraph } from 'graphology-types'
import serializedGraph from './data.json'
import { graph } from './graph'
import { findAllRoutes } from './graph/route'
import { initializeState } from './graph/state'
import { Edge, Node } from './types/graph'
import { map } from './utils'

initializeState()

const data = serializedGraph as SerializedGraph<Node, Edge>
const mapper = map(0, 10, 1.5, 6)

let lowcosts = 0
let nonLowcosts = 0

for (const node of data.nodes) {
  graph.addNode(
    node.key,
    node.attributes
      ? {
          ...node.attributes,
          size: mapper(node.attributes.size)
        }
      : {}
  )
}

for (const edge of data.edges) {
  if (edge.attributes && edge.attributes.lowcost) {
    lowcosts++
  } else {
    nonLowcosts++
  }
  graph.addDirectedEdgeWithKey(
    edge.key,
    edge.source,
    edge.target,
    edge.attributes
      ? {
          ...edge.attributes,
          color: 'rgba(0, 0, 0, 0.1)',
          size: edge.attributes.size * 0.1
        }
      : {}
  )
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
