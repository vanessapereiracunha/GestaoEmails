export interface HttpClient {
  get<T>(url: string, params?: Record<string, any>): Promise<T>
  post<T>(url: string, body?: any): Promise<T>
  patch<T>(url: string, body?: any): Promise<T>
}

export function createHttpClient(baseUrl: string): HttpClient {
  const base = baseUrl.replace(/\/$/, '')
  const headers = { 'Content-Type': 'application/json' }

  return {
    async get(url, params) {
      const qs = params ? '?' + new URLSearchParams(params as any).toString() : ''
      const res = await fetch(base + url + qs)
      if (!res.ok) throw new Error('HTTP ' + res.status)
      return res.json()
    },
    async post(url, body) {
      const res = await fetch(base + url, { method: 'POST', headers, body: JSON.stringify(body ?? {}) })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      return res.json()
    },
    async patch(url, body) {
      const res = await fetch(base + url, { method: 'PATCH', headers, body: JSON.stringify(body ?? {}) })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      return res.json()
    },
  }
}
