export type Airline = {
  id: number
  callsign: string
  ICAO: string
  IATA: string
  name: string
  fs_id: string
  shortname: string
  fullname: null
  country: string
  flights_last_24_hours: string
  airbourne: string
  location: string
  phone: string
  url: string
  wiki_url: string
  is_scheduled_passenger: string
  is_nonscheduled_passenger: string
  is_cargo: string
  is_railway: null
  is_lowcost: string
  active: string
  is_oneworld: string
  is_staralliance: string
  is_skyteam: string
  is_allianceaffiliate: string
  rating_iosapp: null
  rating_androidapp: null
  rating_skytrax_reviews: null
  rating_skytrax_stars: null
  rating_tripadvisor: null
  rating_trustpilot: null
  rating_flightradar24: null
  created_at: string
  updated_at: string
}
export type DB_Airline = Airline
