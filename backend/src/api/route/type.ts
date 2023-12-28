import { Airline } from '../airline/type'

export type Route = {
  id: number
  route_id: string
  carrier: string
  carrier_name: string
  lcc: string
  iata_from: string
  iata_to: string
  day1: string
  day2: string
  day3: string
  day4: string
  day5: string
  day6: string
  day7: string
  aircraft_codes: string
  first_flight: null
  last_flight: string
  class_first: string
  class_business: string
  class_economy: string
  common_duration: string
  min_duration: string
  max_duration: string
  is_new: string
  is_active: string
  is_layover: string
  passengers_per_day: string
  created_at: string
  updated_at: string
  deleted_at: null
  last_found: string
  flights_per_week: string
  flights_per_day: string
  airline: Airline
}
export type DB_Route = Omit<Route, 'airline'> & {
  airline_id: number
}
