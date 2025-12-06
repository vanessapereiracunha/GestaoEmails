import type { DashboardResumo } from '../model/dashboard'
import { emailService } from './emailService'

export interface IDashboardService {
  resumo(): Promise<DashboardResumo>
}

class DashboardService implements IDashboardService {
  async resumo(): Promise<DashboardResumo> {
    const emails = await emailService.listAll()
    const total = emails.length
    const classificados = emails.filter(e=>e.classificado).length
    const pendentes = total - classificados

    const porUFMap = new Map<string, number>()
    for (const e of emails) {
      const uf = e.uf ?? '—'
      porUFMap.set(uf, (porUFMap.get(uf) ?? 0) + 1)
    }
    const porUF = [...porUFMap.entries()].map(([uf,total])=>({ uf, total }))

    const byDay = new Map<string, number>()
    for (const e of emails) {
      const d = e.dataHora.slice(0,10)
      byDay.set(d, (byDay.get(d) ?? 0) + 1)
    }
    const tendencia7dias = [...byDay.entries()].sort((a,b)=>a[0].localeCompare(b[0])).slice(-7).map(([dia,total])=>({ dia, total }))

    const byDest = new Map<string, number>()
    for (const e of emails) {
      byDest.set(e.destinatario, (byDest.get(e.destinatario) ?? 0) + 1)
    }
    const topDestinatarios = [...byDest.entries()].sort((a,b)=>b[1]-a[1]).slice(0,3).map(([destinatario,total])=>({ destinatario, total }))

    return { total, classificados, pendentes, porUF, tendencia7dias, topDestinatarios }
  }
}

export const dashboardService: IDashboardService = new DashboardService()
