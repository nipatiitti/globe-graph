import { SchemaFieldTypes } from 'redis'
import client from '../../lib/redis'
import { DB_Airline } from '../airline/type'
import { DB_Route, Route } from './type'

export const saveRoute = async (route: DB_Route) => {
  if (await existsRoute(route.id)) return route

  await client.json.set(`route:${route.id}`, '$', route)
  return route
}

export const getRoute = async (id: number) => {
  return (await client.json.get(`route:${id}`)) as DB_Route
}

export const populateRoute = async (route: DB_Route) => {
  const response: Route = {
    ...route,
    airline: (await client.json.get(`airline:${route.airline_id}`)) as DB_Airline
  }
  return response
}

export const existsRoute = async (id: number) => {
  return (await client.exists(`route:${id}`)) === 1
}
;(async () => {
  try {
    console.log('Creating route index...')
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
      console.log('Route index exists already, skipped creation.')
    } else {
      // Something went wrong, perhaps RediSearch isn't installed...
      console.error(e)
      process.exit(1)
    }
  }
})()
