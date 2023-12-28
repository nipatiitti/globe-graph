import { EdgeDisplayData, NodeDisplayData } from 'sigma/types'
import { graph, renderer } from '.'
import { Edge } from '../types/graph'

// Type and declare internal state:
interface State {
  hoveredNode?: string
  hoveredNeighbors?: Set<string>
  lowcostOnly?: boolean
  routes?: Array<string>
}
export const state: State = {}

declare global {
  interface Window {
    state: State
  }
}

export const initializeState = () => {
  window.state = state
}

function setHoveredNode(node?: string) {
  if (node) {
    state.hoveredNode = node
    state.hoveredNeighbors = new Set(graph.neighbors(node))
  } else {
    state.hoveredNode = undefined
    state.hoveredNeighbors = undefined
  }

  // Refresh rendering:
  renderer.refresh()
}

renderer.on('enterNode', ({ node }) => {
  setHoveredNode(node)
})
renderer.on('leaveNode', () => {
  setHoveredNode(undefined)
})

renderer.setSetting('nodeReducer', (node, data) => {
  const res: Partial<NodeDisplayData> = { ...data }

  if (state.hoveredNeighbors && !state.hoveredNeighbors.has(node) && state.hoveredNode !== node) {
    res.color = '#444343'
  }

  if (state.hoveredNode === node) {
    res.color = '#4b77ee'
    res.highlighted = true
  }

  return res
})

renderer.setSetting('edgeReducer', (edge, data) => {
  const res: Partial<EdgeDisplayData & Edge> = { ...data }

  if (state.hoveredNode && graph.hasExtremity(edge, state.hoveredNode)) {
    res.color = 'rgba(75, 119, 238, 0.1)'
  } else if (state.hoveredNode) {
    res.hidden = true
  }

  if (state.routes && state.routes.includes(edge)) {
    res.color = 'rgba(75, 119, 238, 0.1)'
  } else if (state.routes) {
    res.hidden = true
  }

  if (state.lowcostOnly && !res.lowcost) {
    res.hidden = true
  }

  return res
})
