import { graph } from '.'

// Type and declare internal state:
interface State {
  hoveredNode?: string
  highlightedNodes?: Set<string>
  highlightedRoutes?: Set<string>
  lowcostOnly?: boolean
  takeScreenshot?: boolean
}

export const state: State = {}

declare global {
  interface Window {
    state?: State
  }
}

export const initializeState = () => {
  window.state = state
}

export const setState = (newState: Partial<State>) => {
  Object.assign(state, newState)
}

export function setHoveredNode(node?: string) {
  if (node) {
    state.hoveredNode = node
    state.highlightedNodes = new Set(graph.neighbors(node))
    state.highlightedRoutes = new Set(graph.outboundEdges(node))
  } else {
    state.hoveredNode = undefined
    state.highlightedNodes = undefined
    state.highlightedRoutes = undefined
  }
}
