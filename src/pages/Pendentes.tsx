import { useEffect, useMemo, useState } from 'react'
import { useListarEmails } from '../hooks/emails/useListarEmails'
import { useClassificarEmail } from '../hooks/emails/useClassificarEmail'
import { useToast } from '../state/toast'
import { downloadCSV, toCSV } from '../utils/csv'
import { Skeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import FiltrosPendentes from '../components/FiltrosPendentes'
import TabelaPendentes from '../components/TabelaPendentes'
import { Download } from 'lucide-react'

export default function Pendentes() {
  const { emails, loading } = useListarEmails()
  const { classificar } = useClassificarEmail()
  const { push } = useToast()
  const [remetente, setRemetente] = useState('')
  const [dataIni, setDataIni] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [salvando, setSalvando] = useState(false)

  const pendentes = useMemo(() => {
    return emails
      .filter(e => !e.classificado)
      .filter(e => remetente ? e.remetente.toLowerCase().includes(remetente.toLowerCase()) : true)
      .filter(e => dataIni ? (new Date(e.dataHora) >= new Date(dataIni)) : true)
      .filter(e => dataFim ? (new Date(e.dataHora) <= new Date(dataFim)) : true)
  }, [emails, remetente, dataIni, dataFim])

  const [page, setPage] = useState(1)
  const pageSize = 20
  const start = (page - 1) * pageSize
  const pageItems = pendentes.slice(start, start + pageSize)
  const totalPages = Math.ceil(pendentes.length / pageSize)
  
  useEffect(() => { setPage(1) }, [remetente, dataIni, dataFim])

  const handleSalvar = async (id: string, uf: string, municipio: string) => {
    setSalvando(true)
    try {
      await classificar(id, uf, municipio)
      push('E-mail classificado com sucesso!', 'success')
    } catch (error) {
      push('Erro ao classificar e-mail', 'error')
    } finally {
      setSalvando(false)
    }
  }

  const handleExportarCSV = () => {
    const csv = toCSV(pendentes.map(p => ({
      id: p.id,
      remetente: p.remetente,
      destinatario: p.destinatario,
      data: new Date(p.dataHora).toLocaleString(),
      uf: p.uf ?? '',
      municipio: p.municipio ?? '',
      classificado: p.classificado ? 'sim' : 'nao',
    })))
    downloadCSV(csv, 'emails-pendentes.csv')
  }

  const handleLimparFiltros = () => {
    setRemetente('')
    setDataIni('')
    setDataFim('')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48"><Skeleton className="h-8 w-48" /></div>
          <div className="h-10 w-32"><Skeleton className="h-10 w-32" /></div>
        </div>
        <div className="h-32"><Skeleton className="h-32" /></div>
        <div className="h-96"><Skeleton className="h-96" /></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-full">
        {/* Cabeçalho */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900">E-mails Pendentes</h1>
        </div>

        {/* Filtros */}
        <div className="mb-16">
          <FiltrosPendentes
            remetente={remetente}
            dataInicial={dataIni}
            dataFinal={dataFim}
            onRemetenteChange={setRemetente}
            onDataInicialChange={setDataIni}
            onDataFinalChange={setDataFim}
            onLimpar={handleLimparFiltros}
          />
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[700px]">
          <TabelaPendentes
            emails={pageItems.map(email => ({
              id: email.id,
              remetente: email.remetente,
              destinatario: email.destinatario,
              dataHora: email.dataHora,
              uf: email.uf || undefined,
              municipio: email.municipio || undefined,
            }))}
            paginaAtual={page}
            totalPaginas={totalPages}
            onSalvar={handleSalvar}
            salvando={salvando}
            onPaginaAnterior={() => setPage(page - 1)}
            onPaginaProxima={() => setPage(page + 1)}
          />
        </div>

        {/* Botão Exportar CSV */}
        {pendentes.length > 0 && (
          <div className="flex justify-end mt-16">
            <button
              onClick={handleExportarCSV}
              className="h-12 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 inline-flex items-center gap-2 text-lg shadow-sm"
            >
              <Download size={20} />
              Exportar CSV
            </button>
          </div>
        )}

        {pendentes.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <EmptyState description="Nenhum e-mail pendente encontrado." />
          </div>
        )}
      </div>
    </div>
  )
}