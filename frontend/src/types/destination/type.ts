import { Airport } from '../airport/type'
import { Route } from '../route/type'

export type Destination = {
  id: number
  iata_from: string
  iata_to: string
  day1: string
  day2: string
  day3: string
  day4: string
  day5: string
  day6: string
  day7: string
  first_flight: string | null
  last_flight: string | null
  class_first: string
  class_business: string
  class_economy: string
  common_duration: string
  min_duration: string
  max_duration: string
  is_new: string
  is_active: string
  faq_content: string
  passengers_per_day: string
  created_at: string
  updated_at: string
  deleted_at: null
  last_found: string
  price: string
  flights_per_day: string
  flights_per_week: string
  faq_content_df: string
  live_updated_at: null
  airport: Airport
  airlineroutes: Array<Route>
}

export type DB_Destination = Omit<Destination, 'airport' | 'airlineroutes'> & {
  airport_id: number
  airlineroutes_ids: number[]
}
export type DB_Dest_Id = {
  iata_from: string
  iata_to: string
}
