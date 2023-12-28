import { iterateAirport } from './api/airport/db'
import { fetchDestinations } from './api/destination/api'
import { destinationToDB, findConnections } from './api/destination/db'
import client from './lib/redis'

const getStartingParams = async (): Promise<[Set<string>, Set<string>]> => {
  const queue = new Set<string>()

  let maxCount = (await client.keys('airport:*')).length
  let count = 0

  await iterateAirport(async (airport) => {
    queue.add(airport.IATA)

    count++

    if (count % 100 === 0) {
      console.log(`Processed ${count} of ${maxCount} airports: (${Math.round((count / maxCount) * 100)}%)`)
    }
  })
  console.log(`${queue.size} seen airports found.`)

  maxCount = queue.size
  count = 0
  const visited = new Set<string>()

  for (const iata of queue) {
    const exists = (await findConnections(iata)).length > 0

    if (exists) {
      visited.add(iata)
      queue.delete(iata)
    }

    count++
    if (count % 100 === 0) {
      console.log(`Processed ${count} of ${maxCount} seen airports: (${Math.round((count / maxCount) * 100)}%)`)
    }
  }

  return [visited, queue]
}

const scrape = async (startIATA: string) => {
  const [visited, queue] = await getStartingParams()
  console.log(`!!!!Starting scraping!!!! Visited / Queue size: ${visited.size} / ${queue.size + visited.size}`)

  queue.add(startIATA)

  while (queue.size > 0) {
    const iata = queue.values().next().value as string
    queue.delete(iata)

    if (visited.has(iata)) continue

    const destinations = await fetchDestinations(iata)
    for (const dest of destinations) {
      await destinationToDB(dest)
      if (!visited.has(dest.iata_to)) {
        queue.add(dest.iata_to)
      }
    }

    visited.add(iata)

    console.log(
      `Visited ${visited.size} / Queue size: ${queue.size} (${Math.round(
        (visited.size / (queue.size + visited.size)) * 100
      )}%)`
    )
  }

  console.log('Done!')
}

scrape('ARN')
