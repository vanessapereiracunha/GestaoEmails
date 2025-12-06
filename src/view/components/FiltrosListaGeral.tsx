import { Search, Calendar, MapPin, Filter, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchEstados, fetchMunicipios } from '../../services/ibgeService'

interface FiltrosListaGeralProps {
  remetente: string
  destinatario: string
  uf: string
  municipio: string
  status: string
  dataInicial: string
  dataFinal: string
  onRemetenteChange: (value: string) => void
  onDestinatarioChange: (value: string) => void
  onUfChange: (value: string) => void
  onMunicipioChange: (value: string) => void
  onStatusChange: (value: string) => void
  onDataInicialChange: (value: string) => void
  onDataFinalChange: (value: string) => void
  onAplicar: () => void
  onLimpar: () => void
}

export default function FiltrosListaGeral({
  remetente,
  destinatario,
  uf,
  municipio,
  status,
  dataInicial,
  dataFinal,
  onRemetenteChange,
  onDestinatarioChange,
  onUfChange,
  onMunicipioChange,
  onStatusChange,
  onDataInicialChange,
  onDataFinalChange,
  onAplicar,
  onLimpar
}: FiltrosListaGeralProps) {
  const [ufs, setUfs] = useState<{ sigla: string, nome: string }[]>([])
  const [municipios, setMunicipios] = useState<string[]>([])

  useEffect(() => {
    fetchEstados()
      .then((estados: { sigla: string; nome: string }[]) => setUfs(estados.map((e: { sigla: string; nome: string }) => ({ sigla: e.sigla, nome: e.nome }))))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!uf) {
      setMunicipios([])
      return
    }
    fetchMunicipios(uf)
      .then((ms: { nome: string }[]) => setMunicipios(ms.map((m: { nome: string }) => m.nome)))
      .catch(() => {})
  }, [uf])

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filtros Avançados</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por remetente"
            value={remetente}
            onChange={(e) => onRemetenteChange(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
        
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por destinatário"
            value={destinatario}
            onChange={(e) => onDestinatarioChange(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
        
        <div className="relative">
          <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={uf}
            onChange={(e) => onUfChange(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none"
          >
            <option value="">Todas as UFs</option>
            {ufs.map(uf => (
              <option key={uf.sigla} value={uf.sigla}>{uf.sigla} - {uf.nome}</option>
            ))}
          </select>
        </div>
        
        <div className="relative">
          <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={municipio}
            onChange={(e) => onMunicipioChange(e.target.value)}
            disabled={!uf}
            className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none disabled:bg-gray-100"
          >
            <option value="">Todos os municípios</option>
            {municipios.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        >
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="classificado">Classificado</option>
        </select>
        
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
      </div>
      
      <div className="flex gap-3 mt-6">
        <button
          onClick={onAplicar}
          className="h-11 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 inline-flex items-center gap-2 font-medium"
        >
          <Filter size={18} />
          Aplicar Filtros
        </button>
        <button
          onClick={onLimpar}
          className="h-11 px-6 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 inline-flex items-center gap-2"
        >
          <X size={18} />
          Limpar Filtros
        </button>
      </div>
    </div>
  )
}
