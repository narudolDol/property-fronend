import axios, { AxiosError } from 'axios'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const BASE_URL = 'http://localhost:3001/api/v1'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
})

function nestMessage(data: unknown): string | null {
  // Nest often returns: { message: string | string[]; error: string; statusCode: number }
  if (!data || typeof data !== 'object') return null

  const msg = (data as { message?: unknown }).message
  if (typeof msg === 'string') return msg

  if (Array.isArray(msg)) {
    const parts = msg.filter((x): x is string => typeof x === 'string')
    return parts.length > 0 ? parts.join(', ') : null
  }

  return null
}

apiClient.interceptors.response.use(
  (res) => res,
  (e: unknown) => {
    if (!(e instanceof AxiosError)) return Promise.reject(e)

    const status = e.response?.status ?? 0
    const message = nestMessage(e.response?.data) ?? (status ? `Request failed (${status})` : 'Network error')
    return Promise.reject(new ApiError(message, status))
  },
)

export default apiClient


