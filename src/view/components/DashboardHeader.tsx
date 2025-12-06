import { Link } from 'react-router-dom'
import { Clock, Send } from 'lucide-react'

export default function DashboardHeader() {
  return (
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
  )
}
