import { Search, Calendar, X } from 'lucide-react'

interface FiltrosPendentesProps {
  remetente: string
  dataInicial: string
  dataFinal: string
  onRemetenteChange: (value: string) => void
  onDataInicialChange: (value: string) => void
  onDataFinalChange: (value: string) => void
  onLimpar: () => void
}

export default function FiltrosPendentes({
  remetente,
  dataInicial,
  dataFinal,
  onRemetenteChange,
  onDataInicialChange,
  onDataFinalChange,
  onLimpar
}: FiltrosPendentesProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Filtrar por remetente"
            value={remetente}
            onChange={(e) => onRemetenteChange(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
        
        <div className="relative">
          <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            placeholder="Data inicial"
            value={dataInicial}
            onChange={(e) => onDataInicialChange(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
        
        <div className="relative">
          <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            placeholder="Data final"
            value={dataFinal}
            onChange={(e) => onDataFinalChange(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
        
        <button
          onClick={onLimpar}
          className="w-full h-11 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 inline-flex items-center justify-center gap-2"
        >
          <X size={18} />
          Limpar filtros
        </button>
      </div>
    </div>
  )
}
