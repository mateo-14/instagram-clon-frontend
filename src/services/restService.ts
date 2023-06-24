import axios from 'axios'

const URL = process.env.NEXT_PUBLIC_API_URL

const client = axios.create({ baseURL: URL })

export default client
