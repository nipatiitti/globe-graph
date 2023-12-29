import { Deck } from '@deck.gl/core/typed'
import { DataFilterExtension } from '@deck.gl/extensions/typed'
import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers/typed'
import { saveAs } from 'file-saver'
import Graph from 'graphology'
import { data } from '../data'
import { Edge, Node } from '../types/graph'
import { map as mapper } from '../utils'
import { edgeColor } from './colourer'
import { setHoveredNode, setState } from './state'

const container = document.getElementById('sigma-container') as HTMLDivElement

const INITIAL_VIEW_STATE = {
  latitude: 0,
  longitude: 0,
  zoom: 1,
  pitch: 30
}

let viewState = INITIAL_VIEW_STATE as Record<string, any>

export const graph = new Graph({
  multi: false,
  type: 'directed'
})

const radiusMap = mapper(0, 1, 1, 100)
const widthMap = mapper(0, 100, 0.1, 4)

type NodeWithKey = Node & { key: string }
type EdgeWithKey = Edge & { key: string }

const getNodeColor = (d: NodeWithKey): [number, number, number] => {
  if (!window.state?.hoveredNode || !window.state?.highlightedNodes) return [255, 0, 0]

  if (window.state?.hoveredNode === d.key) return [0, 255, 0]
  else if (window.state?.highlightedNodes.has(d.key)) return [0, 0, 255]
  else if (window.state?.hoveredNode || window.state?.highlightedNodes) return [0, 0, 0]

  return [255, 0, 0]
}

const getEdgeColor = (d: EdgeWithKey, dir: 'source' | 'target' = 'source'): [number, number, number, number] => {
  let alpha = 10

  if (!window.state?.highlightedRoutes) return [0, 0, 0, alpha]

  if (window.state?.highlightedRoutes.has(d.key)) return [...edgeColor(d.key), 150]
  else if (window.state?.highlightedRoutes) return [0, 0, 0, alpha]

  return [0, 0, 0, alpha]
}

const getEdgeFilter = (d: EdgeWithKey): number => {
  if (!window.state) return 1

  const { lowcostOnly, highlightedRoutes } = window.state

  if (lowcostOnly && !d.lowcost) return 0

  if (highlightedRoutes && !highlightedRoutes.has(d.key)) return 0
  else if (highlightedRoutes) return 1

  return 1
}

export const generateAirportLayer = () =>
  new ScatterplotLayer<NodeWithKey>({
    data: data.nodes.map((node) => ({ ...node.attributes, key: node.key })),
    getPosition: (d) => [d.x, d.y],
    getFillColor: (d) => getNodeColor(d),
    getRadius: (d) => radiusMap(d.size),
    pickable: true,
    opacity: 1,
    filled: true,
    radiusScale: 100,
    radiusMinPixels: 0.5,
    radiusMaxPixels: 300,
    lineWidthMinPixels: 1
  })

export const generateRouteLayer = () =>
  new ArcLayer<EdgeWithKey>({
    id: 'arcs',
    data: data.edges.map((edge) => ({ ...edge.attributes, key: edge.key })),
    getSourcePosition: (e) => e.from_position,
    getTargetPosition: (e) => e.to_position,
    getSourceColor: (e) => getEdgeColor(e, 'source'),
    getTargetColor: (e) => getEdgeColor(e, 'target'),
    getWidth: (e) => widthMap(e.freq),
    wrapLongitude: true,
    widthMinPixels: 0.5,
    // @ts-ignore
    filterRange: [1, 1],
    getFilterValue: (e: any) => getEdgeFilter(e),
    extensions: [new DataFilterExtension({ filterSize: 1 })]
  })

export const deckOverlay = new Deck({
  controller: true,
  parent: container,
  initialViewState: INITIAL_VIEW_STATE,
  layers: [generateAirportLayer(), generateRouteLayer()],
  glOptions: {
    preserveDrawingBuffer: true
  },
  onViewStateChange: ({ viewState: newViewState }) => {
    viewState = newViewState
    viewStateRender()
  },
  getTooltip: ({ object }) => {
    if (!object) return null

    const { label, size } = object as Node
    return `Airport: ${label} (${Math.round(size * 50)})`
  },
  onClick: ({ object }) => {
    setHoveredNode(object?.key)
    render()
  },
  onAfterRender: () => {
    if (window.state?.takeScreenshot) {
      // @ts-ignore
      const img = deckOverlay.canvas?.toDataURL('image/png')
      if (img) saveAs(img, 'graph.png')
      window.state.takeScreenshot = false
    }
  }
})

export const render = () => {
  const airports = generateAirportLayer()
  const routes = generateRouteLayer()

  deckOverlay.setProps({
    layers: [airports, routes]
  })
}

export const viewStateRender = () => {
  deckOverlay.setProps({ viewState })
}

const zoomResetBtn = document.getElementById('zoom-reset') as HTMLButtonElement
const exportPngBtn = document.getElementById('export-png') as HTMLButtonElement
const lowcostCheckbox = document.getElementById('lowcost') as HTMLInputElement

zoomResetBtn.addEventListener('click', () => {
  console.log('reset')
  deckOverlay.setProps({ viewState: INITIAL_VIEW_STATE })
})

lowcostCheckbox.addEventListener('change', () => {
  setState({ lowcostOnly: lowcostCheckbox.checked })
  render()
})

exportPngBtn.addEventListener('click', () => {
  setState({ takeScreenshot: true })
  render()
})
