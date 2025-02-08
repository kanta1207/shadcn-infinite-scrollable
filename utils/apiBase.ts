type ApiResponse<T> = {
  status: number
  data: T
  headers: Headers
}

type FetchOptions = {
  method?: string
  headers?: Record<string, string>
  body?: BodyInit
  cache?: RequestCache
  next?: NextFetchRequestConfig
  credentials?: RequestCredentials
}

/**
 * Custom fetch function with return type param and options
 * @template T Type of the response data
 * @param {string} path - The request path
 * @param {FetchOptions} options - The fetch options
 * @returns {Promise<ApiResponse<T>>} The promise of the API response
 */
export async function fetchWithOptions<T>(path: string, options: FetchOptions): Promise<ApiResponse<T>> {
  const url = path
  const response = await fetch(url, options)
  const data = await response.json()
  return {
    status: response.status,
    data,
    headers: response.headers
  }
}
