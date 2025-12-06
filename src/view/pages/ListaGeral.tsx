import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useFiltroListaGeral } from '../../viewmodel/emails/useFiltroListaGeral'
import { Table, TTable, THead, TRow, TCell } from '../components/Table'
import Pagination from '../components/Pagination'
import EmptyState from '../components/EmptyState'
import { Skeleton } from '../components/Skeleton'
import Badge from '../components/Badge'
import { X } from 'lucide-react'

export default function ListaGeral(){
  const {
    loading,
    q,
    setQ,
    dataIni,
    setDataIni,
    dataFim,
    setDataFim,
    filtered,
    page,
    setPage,
    pageSize,
    pageItems,
  } = useFiltroListaGeral()

  const handleLimparFiltros = () => {
    setQ('')
    setDataIni('')
    setDataFim('')
  }

  return (
    <div className="space-y-6 text-base">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">Histórico de E-mails</h1>

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-3 text-sm items-end">
          <div className="flex flex-col gap-1 col-span-3">
            <label className="block text-xs font-medium text-slate-600">Busca</label>
            <input
              value={q}
              onChange={e=>setQ(e.target.value)}
              placeholder="Buscar por remetente, destinatário ou assunto"
              className="border rounded-md px-4 h-11 text-base bg-white text-slate-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-xs font-medium text-slate-600">Data inicial (dd/mm/aaaa)</label>
            <input
              type="date"
              value={dataIni}
              onChange={e=>setDataIni(e.target.value)}
              className="border rounded-md px-4 h-11 text-base bg-white text-slate-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-xs font-medium text-slate-600">Data final (dd/mm/aaaa)</label>
            <input
              type="date"
              value={dataFim}
              onChange={e=>setDataFim(e.target.value)}
              className="border rounded-md px-4 h-11 text-base bg-white text-slate-900"
            />
          </div>
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
                  <EmptyState description="Nenhum e-mail encontrado. Ajuste a busca ou filtros, ou aguarde nova ingestão." />
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
