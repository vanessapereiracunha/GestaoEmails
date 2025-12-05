import { Link } from 'react-router-dom'
import { useDashboard } from '../hooks/useDashboard'
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
import { 
  Mail, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Send
} from 'lucide-react'
import { Skeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import DashboardCard from '../components/DashboardCard'

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
  
  if (!data) return <EmptyState description="Sem dados para exibir no momento." />

  const porUfLabels = displayData.porUF.map(x => x.uf)
  const porUfValues = displayData.porUF.map(x => x.total)
  const trendLabels = displayData.tendencia7dias.map(p => p.dia.slice(5))
  const trendValues = displayData.tendencia7dias.map(p => p.total)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-3">
          <Link 
            to="/pendentes" 
            className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 inline-flex items-center gap-2 transition-colors"
          >
            <Clock size={18} />
            Ver Pendentes
          </Link>
          <Link 
            to="/cadastro" 
            className="px-4 py-2.5 rounded-lg bg-gray-900 text-white shadow-sm hover:bg-gray-800 inline-flex items-center gap-2 transition-colors"
          >
            <Send size={18} />
            Novo Manual
          </Link>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="TOTAL" 
          value={data.total} 
          icon={Mail}
          color="blue"
        />
        <DashboardCard 
          title="CLASSIFICADOS" 
          value={data.classificados} 
          icon={CheckCircle}
          color="green"
        />
        <DashboardCard 
          title="PENDENTES" 
          value={data.pendentes} 
          icon={Clock}
          color="orange"
        />
      </div>

        {/* Área de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="E-mails por Estado">
          {porUfValues.length ? (
            <Bar
              data={{
                labels: porUfLabels,
                datasets: [{
                  label: 'E-mails',
                  data: porUfValues,
                  backgroundColor: '#6366f1',
                }],
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <span>Sem dados</span>
            </div>
          )}
        </ChartCard>
        
        <ChartCard title="Tendência últimos 7 dias">
          {trendValues.length ? (
            <Line
              data={{
                labels: trendLabels,
                datasets: [{
                  label: 'E-mails por dia',
                  data: trendValues,
                  borderColor: '#38bdf8',
                  backgroundColor: 'rgba(56,189,248,0.2)',
                  tension: 0.3,
                }],
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

        {/* Top Destinatários */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={20} className="text-indigo-600" />
          Top Destinatários
        </h2>
        <ol className="space-y-3">
          {data.topDestinatarios.map((t, index) => (
            <li key={t.destinatario} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700">{t.destinatario}</span>
              </div>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                {t.total}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-indigo-600" />
        {title}
      </h2>
      {children}
    </section>
  )
}
