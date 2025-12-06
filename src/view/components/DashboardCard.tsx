import { LucideIcon } from 'lucide-react'

interface DashboardCardProps {
  title: string
  value: number
  icon: LucideIcon
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'teal' | 'emerald' | 'amber'
}

export default function DashboardCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue' 
}: DashboardCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    teal: 'bg-teal-50 text-teal-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        <div className="text-sm text-gray-500 uppercase tracking-wide">
          {title}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900">
        {value.toLocaleString('pt-BR')}
      </div>
    </div>
  )
}
