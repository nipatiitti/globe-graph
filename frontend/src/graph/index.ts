import Graph from 'graphology'
import Sigma from 'sigma'
import saveAsPNG from './saveAsPng'

const container = document.getElementById('sigma-container') as HTMLElement
const zoomInBtn = document.getElementById('zoom-in') as HTMLButtonElement
const zoomOutBtn = document.getElementById('zoom-out') as HTMLButtonElement
const zoomResetBtn = document.getElementById('zoom-reset') as HTMLButtonElement
const labelsThresholdRange = document.getElementById('labels-threshold') as HTMLInputElement
const exportPngBtn = document.getElementById('export-png') as HTMLButtonElement
const lowcostCheckbox = document.getElementById('lowcost') as HTMLInputElement

export const graph = new Graph({
  type: 'directed',
  multi: false,
  allowSelfLoops: true
})

// Instanciate sigma:
export const renderer = new Sigma(graph, container, {
  minCameraRatio: 0.1,
  maxCameraRatio: 10,
  labelColor: {
    attribute: 'label-color',
    color: '#358632'
  }
})
const camera = renderer.getCamera()

// Bind zoom manipulation buttons
zoomInBtn.addEventListener('click', () => {
  camera.animatedZoom({ duration: 600 })
})
zoomOutBtn.addEventListener('click', () => {
  camera.animatedUnzoom({ duration: 600 })
})
zoomResetBtn.addEventListener('click', () => {
  camera.animatedReset({ duration: 600 })
})
labelsThresholdRange.addEventListener('input', () => {
  renderer.setSetting('labelRenderedSizeThreshold', +labelsThresholdRange.value)
})
labelsThresholdRange.value = renderer.getSetting('labelRenderedSizeThreshold') + ''

exportPngBtn.addEventListener('click', () => {
  saveAsPNG(renderer)
})

lowcostCheckbox.addEventListener('change', () => {
  window.state.lowcostOnly = lowcostCheckbox.checked
  renderer.refresh()
})
