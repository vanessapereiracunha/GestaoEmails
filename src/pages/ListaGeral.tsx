import { Link } from 'react-router-dom'
import { useListarEmails } from '../hooks/emails/useListarEmails'
import { useEffect, useMemo, useState } from 'react'
import { Table, TTable, THead, TRow, TCell } from '../components/Table'
import Pagination from '../components/Pagination'
import EmptyState from '../components/EmptyState'
import { Skeleton } from '../components/Skeleton'
import Badge from '../components/Badge'
import { X } from 'lucide-react'

export default function ListaGeral(){
  const { emails, loading } = useListarEmails()
  const [q, setQ] = useState('')
  const [debounced, setDebounced] = useState('')
  const [dataIni, setDataIni] = useState('')
  const [dataFim, setDataFim] = useState('')

  useEffect(()=>{
    const t = setTimeout(()=> setDebounced(q), 300)
    return ()=> clearTimeout(t)
  }, [q])

  const filtered = useMemo(()=> {
    return emails
      .filter(e=> debounced ? (
        e.remetente.toLowerCase().includes(debounced.toLowerCase()) ||
        e.destinatario.toLowerCase().includes(debounced.toLowerCase()) ||
        (e.assunto ?? '').toLowerCase().includes(debounced.toLowerCase())
      ) : true)
      .filter(e=> dataIni ? (new Date(e.dataHora) >= new Date(dataIni)) : true)
      .filter(e=> dataFim ? (new Date(e.dataHora) <= new Date(dataFim)) : true)
  }, [emails, debounced, dataIni, dataFim])

  const [page, setPage] = useState(1)
  const pageSize = 20
  const start = (page - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)
  useEffect(()=>{ setPage(1) }, [debounced, dataIni, dataFim])

  const handleLimparFiltros = () => {
    setQ('')
    setDataIni('')
    setDataFim('')
  }

  return (
    <div className="space-y-6 text-base">
      <h1 className="text-3xl font-semibold">Histórico de E-mails</h1>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-4">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por remetente, destinatário ou assunto" className="border rounded-md px-4 py-3 text-base col-span-3" />
          <input type="date" value={dataIni} onChange={e=>setDataIni(e.target.value)} className="border rounded-md px-4 py-3 text-base" />
          <input type="date" value={dataFim} onChange={e=>setDataFim(e.target.value)} className="border rounded-md px-4 py-3 text-base" />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleLimparFiltros}
            className="inline-flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-md text-base text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X size={16} />
            Limpar Filtros
          </button>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      )}
      <Table>
        <TTable>
          <THead>
            <TRow>
              <TCell header>Remetente</TCell>
              <TCell header>Destinatário</TCell>
              <TCell header>Assunto</TCell>
              <TCell header>Status</TCell>
              <TCell header>Local</TCell>
            </TRow>
          </THead>
          <tbody className="min-h-96">
            {pageItems.map(e=> (
              <TRow key={e.id}>
                <TCell>{e.remetente}</TCell>
                <TCell><Link to={`/detalhes/${e.id}`} className="text-blue-600 hover:underline">{e.destinatario}</Link></TCell>
                <TCell>{e.assunto ?? '–'}</TCell>
                <TCell>{e.classificado ? <Badge color="green">Classificado</Badge> : <Badge color="indigo">Pendente</Badge>}</TCell>
                <TCell>{e.uf ?? '–'} / {e.municipio ?? '–'}</TCell>
              </TRow>
            ))}
            {!loading && pageItems.length === 0 && (
              <TRow>
                <TCell className="py-6" colSpan={5 as any}>
                  <EmptyState description="Ajuste a busca ou filtros para encontrar resultados." />
                </TCell>
              </TRow>
            )}
          </tbody>
        </TTable>
      </Table>
      {!loading && filtered.length > 0 && (
        <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} />
      )}
    </div>
  )
}
