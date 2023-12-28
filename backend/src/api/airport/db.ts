import { SchemaFieldTypes } from 'redis'
import client from '../../lib/redis'
import { DB_Airport } from './type'

export const saveAirport = async (airport: DB_Airport) => {
  if (await existsAirport(airport.id)) return airport

  await client.json.set(`airport:${airport.id}`, '$', airport)
  return airport
}

export const getAirport = async (id: number) => {
  return (await client.json.get(`airport:${id}`)) as DB_Airport
}

export const getAirportByIATA = async (iata: string) => {
  const { documents } = await client.ft.search('idx:airport', `@IATA:(${iata})`)
  if (documents.length === 0) return null
  const { value } = documents[0]
  return value as DB_Airport
}

export const iterateAirport = async (cb: (dest: DB_Airport) => Promise<void> | void) => {
  const iterator = client.scanIterator({
    MATCH: 'airport:*',
    COUNT: 1000
  })

  for await (const key of iterator) {
    const dest = (await client.json.get(key)) as DB_Airport
    await cb(dest)
  }
}

export const existsAirport = async (id: number) => {
  return (await client.exists(`airport:${id}`)) === 1
}
;(async () => {
  try {
    console.log('Creating airport index...')
    await client.ft.create(
      'idx:airport',
      {
        '$.name': {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: true
        },
        '$.IATA': {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: true,
          AS: 'IATA'
        }
      },
      {
        ON: 'JSON',
        PREFIX: 'airport:'
      }
    )
  } catch (e: any) {
    if (e.message === 'Index already exists') {
      console.log('Airport index exists already, skipped creation.')
    } else {
      // Something went wrong, perhaps RediSearch isn't installed...
      console.error(e)
      process.exit(1)
    }
  }
})()
