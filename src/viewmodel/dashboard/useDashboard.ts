import { useEffect, useState } from 'react'
import type { DashboardResumo } from '../../model/dashboard'
import { dashboardService } from '../../services/dashboardService'
import { useToast } from '../../state/toast'

export function useDashboard() {
  const [data, setData] = useState<DashboardResumo | null>(null)
  const [loading, setLoading] = useState(false)
  const { push } = useToast()

  async function load() {
    setLoading(true)
    try {
      setData(await dashboardService.resumo())
    } catch (err: any) {
      push({
        variant: 'error',
        title: 'Erro ao carregar dashboard',
        description: err?.message || 'Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])
  return { data, loading, reload: load }
}
