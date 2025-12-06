import { Check, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchEstados, fetchMunicipios } from '../../services/ibgeService'

interface LinhaEmailPendenteProps {
  email: {
    id: string
    remetente: string
    destinatario: string
    dataHora: string
    uf?: string
    municipio?: string
  }
  onSalvar: (id: string, uf: string, municipio: string) => void
  salvando?: boolean
}

export default function LinhaEmailPendente({ email, onSalvar, salvando = false }: LinhaEmailPendenteProps) {
  const [ufs, setUfs] = useState<{ sigla: string, nome: string }[]>([])
  const [municipios, setMunicipios] = useState<string[]>([])
  const [ufSelecionada, setUfSelecionada] = useState(email.uf || '')
  const [municipioSelecionado, setMunicipioSelecionado] = useState(email.municipio || '')

  useEffect(() => {
    fetchEstados()
      .then(estados => setUfs(estados.map(e => ({ sigla: e.sigla, nome: e.nome }))))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!ufSelecionada) {
      setMunicipios([])
      return
    }
    fetchMunicipios(ufSelecionada)
      .then(ms => setMunicipios(ms.map(m => m.nome)))
      .catch(() => {})
  }, [ufSelecionada])

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-slate-900">{email.remetente}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-slate-800">{email.destinatario}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-slate-800">
          {new Date(email.dataHora).toLocaleDateString('pt-BR')}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-800">
          <MapPin size={16} className="text-slate-400" />
          {email.uf && email.municipio 
            ? `${email.uf} - ${email.municipio}`
            : 'Não definido'
          }
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <select
            value={ufSelecionada}
            onChange={(e) => setUfSelecionada(e.target.value)}
            className="h-10 px-3 border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
          >
            <option value="">UF</option>
            {ufs.map(uf => (
              <option key={uf.sigla} value={uf.sigla}>{uf.sigla}</option>
            ))}
          </select>
          
          <select
            value={municipioSelecionado}
            onChange={(e) => setMunicipioSelecionado(e.target.value)}
            disabled={!ufSelecionada}
            className="h-10 px-3 border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm disabled:bg-slate-100"
          >
            <option value="">Município</option>
            {municipios.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          
          <button
            onClick={() => onSalvar(email.id, ufSelecionada, municipioSelecionado)}
            disabled={!ufSelecionada || !municipioSelecionado || salvando}
            className="h-10 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center gap-2 text-sm font-medium"
          >
            <Check size={16} />
            Salvar
          </button>
        </div>
      </td>
    </tr>
  )
}
