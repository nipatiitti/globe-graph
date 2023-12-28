import axios from 'axios'

export const API = axios.create({
  baseURL: 'https://www.flightsfrom.com/api'
})
