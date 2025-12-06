import { useDashboard } from '../../viewmodel/dashboard/useDashboard'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { Mail, CheckCircle, Clock } from 'lucide-react'
import { Skeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import DashboardCard from '../components/DashboardCard'
import DashboardHeader from '../components/DashboardHeader'
import { ChartCard } from '../components/ChartCard'
import TopDestinatarios from '../components/TopDestinatarios'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend)

export default function Dashboard() {
  const { data, loading, reload } = useDashboard()
  
  // Fallback para dados mock se não houver dados do banco
  const displayData = data || {
    total: 0,
    classificados: 0,
    pendentes: 0,
    porUF: [],
    tendencia7dias: [],
    topDestinatarios: []
  }

  if (loading) return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40"><Skeleton className="h-8 w-40" /></div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-36 rounded-lg" />
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  )
  
  if (!data) return <EmptyState description="Ainda não há dados suficientes para o dashboard. Aguarde a ingestão automática de e-mails." />

  const porUfLabels = displayData.porUF.map((x) => x.uf)
  const porUfValues = displayData.porUF.map((x) => x.total)
  const trendLabels = displayData.tendencia7dias.map((p) => p.dia.slice(5))
  const trendValues = displayData.tendencia7dias.map((p) => p.total)

  return (
    <div className="space-y-8">
      {/* Header hero */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
            Visão geral dos envios
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Acompanhe o volume de e-mails enviados pelos colaboradores, o progresso da classificação
            por UF e a tendência diária dos envios capturados automaticamente pelo sistema.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={reload}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-3.5 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-400/20 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Atualizar dados
          </button>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard
          title="Total de e-mails"
          value={data.total}
          icon={Mail}
          color="teal"
        />
        <DashboardCard
          title="Classificados"
          value={data.classificados}
          icon={CheckCircle}
          color="emerald"
        />
        <DashboardCard
          title="Pendentes"
          value={data.pendentes}
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Área de gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ChartCard title="Distribuição por UF">
            {porUfValues.length ? (
              <Bar
                data={{
                  labels: porUfLabels,
                  datasets: [
                    {
                      label: 'E-mails',
                      data: porUfValues,
                      backgroundColor: '#22c55e',
                    },
                  ],
                }}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <span>Sem dados</span>
              </div>
            )}
          </ChartCard>
        </div>
        <div className="xl:col-span-1">
          <ChartCard title="Tendência (últimos 7 dias)">
            {trendValues.length ? (
              <div className="h-96">
                <Line
                  data={{
                    labels: trendLabels,
                    datasets: [
                      {
                        label: 'E-mails por dia',
                        data: trendValues,
                        borderColor: '#06b6d4',
                        backgroundColor: 'rgba(6,182,212,0.18)',
                        tension: 0.3,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <span>Sem dados</span>
              </div>
            )}
          </ChartCard>
        </div>
      </div>

      {/* Top Destinatários */}
      <TopDestinatarios items={data.topDestinatarios} />
    </div>
  )
}
