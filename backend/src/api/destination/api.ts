import { Destination } from './type'

export const fetchDestinations = async (airportCode: string) => {
  const data = {
    filters: { countries: [], airlines: [], aircrafts: [], timeofday: {}, duration: {}, dates: { method: 'all' } }
  }

  const res = await fetch(`https://www.flightsfrom.com/api/airport/destinations/${airportCode}`, {
    method: 'POST',
    body: JSON.stringify(data)
  })

  const destinations = (await res.json()) as Destination[]
  return destinations
}
