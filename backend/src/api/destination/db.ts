import { SchemaFieldTypes } from 'redis'
import client from '../../lib/redis'
import { saveAirline } from '../airline/db'
import { saveAirport } from '../airport/db'
import { DB_Airport } from '../airport/type'
import { getRoute, populateRoute, saveRoute } from '../route/db'
import { DB_Route, Route } from '../route/type'
import { DB_Dest_Id, DB_Destination, Destination } from './type'

export const destToId = ({ iata_from, iata_to }: DB_Dest_Id) => {
  return `${iata_from}-${iata_to}`
}

export const idToDest = (id: string) => {
  const [_, key] = id.split(':')
  const [iata_from, iata_to] = key.split('-')
  return { iata_from, iata_to }
}

export const saveDestination = async (destination: DB_Destination) => {
  if (await existsDestination(destination)) return destination

  const id = destToId(destination)
  await client.json.set(`destination:${id}`, '$', destination)
  return destination
}

export const getDestination = async (destination: DB_Dest_Id) => {
  const id = destToId(destination)
  return (await client.json.get(`destination:${id}`)) as DB_Destination
}

export const populateDestination = async (destination: DB_Destination) => {
  const response: Destination = {
    ...destination,
    airlineroutes: await Promise.all(
      destination.airlineroutes_ids.map(async (id) => {
        const route = await getRoute(id)
        return await populateRoute(route)
      })
    ),
    airport: (await client.json.get(`airport:${destination.airport_id}`)) as DB_Airport
  }
  return response
}

export const existsDestination = async (destination: DB_Dest_Id) => {
  const id = destToId(destination)
  return (await client.exists(`destination:${id}`)) === 1
}

export const findConnections = async (iata_from: string) => {
  const keys = await client.keys(`destination:${iata_from}-*`)
  return keys
}

export const iterateDestinations = async (cb: (dest: DB_Destination) => Promise<void> | void) => {
  const iterator = client.scanIterator({
    MATCH: 'destination:*',
    COUNT: 100
  })

  console.log('Iterating destinations...')

  for await (const key of iterator) {
    const dest = (await client.json.get(key)) as DB_Destination
    await cb(dest)
  }
}

export const destinationToDB = async (destination: Destination) => {
  try {
    const dest = Object.assign({}, destination)
    const airport_id = (await saveAirport(dest.airport)).id
    const airlineroutes_ids = await Promise.all(
      dest.airlineroutes.map(async (route) => {
        const airline_id = (await saveAirline(route.airline)).id

        const temp = Object.assign({}, route as Omit<Route, 'airline'>, {
          airline_id
        }) as DB_Route

        // @ts-ignore
        delete temp.airline

        const route_id = (await saveRoute(temp)).id
        return route_id
      })
    )

    const temp = Object.assign({}, dest as Omit<Destination, 'airport' | 'airlineroutes'>, {
      airport_id,
      airlineroutes_ids
    }) as DB_Destination

    // @ts-ignore
    delete temp.airport
    // @ts-ignore
    delete temp.airlineroutes

    const destination_id = (await saveDestination(temp)).id
    return destination_id
  } catch (error) {
    console.log(JSON.stringify(destination, null, 2))
    throw error
  }
}
;(async () => {
  try {
    console.log('Creating destination index...')
    await client.ft.create(
      'destination',
      {
        '$.iata_to': {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: true
        },
        '$.iata_from': {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: true
        }
      },
      {
        ON: 'JSON',
        PREFIX: 'destination:'
      }
    )
  } catch (e: any) {
    if (e.message === 'Index already exists') {
      console.log('Destination index exists already, skipped creation.')
    } else {
      // Something went wrong, perhaps RediSearch isn't installed...
      console.error(e)
      process.exit(1)
    }
  }
})()
