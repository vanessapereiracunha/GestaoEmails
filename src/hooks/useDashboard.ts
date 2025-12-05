import { useEffect, useState } from 'react'
import type { DashboardResumo } from '../types/dashboard'
import { dashboardService } from '../services/dashboardService'

export function useDashboard() {
  const [data, setData] = useState<DashboardResumo | null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try { setData(await dashboardService.resumo()) } finally { setLoading(false) }
  }

  useEffect(()=>{ load() }, [])
  return { data, loading, reload: load }
}
