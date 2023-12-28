import { SchemaFieldTypes } from 'redis'
import client from '../../lib/redis'
import { DB_Airline } from './type'

export const saveAirline = async (airline: DB_Airline) => {
  if (await existsAirline(airline.id)) return airline

  await client.json.set(`airline:${airline.id}`, '$', airline)
  return airline
}

export const getAirline = async (id: number) => {
  return (await client.json.get(`airline:${id}`)) as DB_Airline
}

export const existsAirline = async (id: number) => {
  return (await client.exists(`airline:${id}`)) === 1
}
;(async () => {
  try {
    console.log('Creating airline index...')
    await client.ft.create(
      'airline',
      {
        '$.name': {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: true
        }
      },
      {
        ON: 'JSON',
        PREFIX: 'airline:'
      }
    )
  } catch (e: any) {
    if (e.message === 'Index already exists') {
      console.log('Airline index exists already, skipped creation.')
    } else {
      // Something went wrong, perhaps RediSearch isn't installed...
      console.error(e)
      process.exit(1)
    }
  }
})()
