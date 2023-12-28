import fs from 'fs/promises'
import Graph from 'graphology'
import { iterateAirport } from './api/airport/db'
import { iterateDestinations, populateDestination } from './api/destination/db'
import client from './lib/redis'

export type Node = {
  label: string
  x: number
  y: number
  size: number
  color: string
}

export type Edge = {
  label: string
  size: number
  lowcost: boolean
  color: string
}

const exportGraph = async () => {
  const g = new Graph({
    allowSelfLoops: true,
    type: 'directed',
    multi: false
  })

  let maxCount = (await client.keys('airport:*')).length
  let count = 0

  await iterateAirport(async (airport) => {
    g.addNode(airport.IATA, {
      label: airport.name,
      x: +airport.longitude,
      y: +airport.latitude,
      size: +airport.no_routes / 50,
      color: '#F00'
    })
    count++

    if (count % 100 === 0) {
      console.log(`Processed ${count} of ${maxCount} airports: (${Math.round((count / maxCount) * 100)}%)`)
    }
  })

  maxCount = (await client.keys('destination:*')).length
  count = 0

  console.time('iterateDestinations')
  await iterateDestinations(async (dest) => {
    const destination = await populateDestination(dest)
    // const destination = dest

    if (!g.hasNode(destination.iata_from)) {
      console.log(`#### Missing from node ${destination.iata_from} ####`)
      return
    }

    if (!g.hasNode(destination.iata_to)) {
      console.log(`#### Missing to node ${destination.iata_to} ####`)
      return
    }

    g.addDirectedEdgeWithKey(
      `${destination.iata_from}-${destination.iata_to}`,
      destination.iata_from,
      destination.iata_to,
      {
        label: destination.airport.name,
        size: destination.airlineroutes.length,
        lowcost: destination.airlineroutes.some((route) => {
          return route.airline.is_lowcost == '1'
        }),
        freq: destination.airlineroutes.reduce((acc, route) => {
          return acc + parseInt(route.flights_per_week)
        }, 0),
        carriers: destination.airlineroutes.map((route) => route.carrier_name).join(' // '),
        color: '#00F'
      }
    )

    count++
    if (count % 1000 === 0) {
      console.timeEnd('iterateDestinations')
      console.log(`Processed ${count} of ${maxCount} destinations: (${Math.round((count / maxCount) * 100)}%)`)
      console.time('iterateDestinations')
    }
  })

  console.log('Starting export...')
  const exported = JSON.stringify(g.export())
  console.log(`Exported ${exported.length} bytes`)
  await fs.writeFile('./graph.json', exported)
}

exportGraph()
