export interface DashboardResumo {
  total: number
  classificados: number
  pendentes: number
  porUF: { uf: string, total: number }[]
  tendencia7dias: { dia: string, total: number }[]
  topDestinatarios: { destinatario: string, total: number }[]
}
