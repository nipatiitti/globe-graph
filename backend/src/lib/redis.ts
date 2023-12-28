import * as redis from 'redis'

const client = redis.createClient({
  url: `redis://localhost:6379`
})

;(async () => {
  client.on('error', (err) => {
    console.log('Redis Client Error', err)
  })
  client.on('ready', () => console.log('Redis is ready'))
  await client.connect()
  await client.ping()
})()

export default client
