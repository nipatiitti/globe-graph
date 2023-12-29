import { SerializedGraph } from 'graphology-types'
import serializedGraph from './graph.json'
import { Edge } from './types/graph'

export const data = serializedGraph as SerializedGraph<Node, Edge>

declare global {
  interface Window {
    data: SerializedGraph<Node, Edge>
  }
}
window.data = data
