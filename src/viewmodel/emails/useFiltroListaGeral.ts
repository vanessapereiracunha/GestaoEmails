import { useEffect, useMemo, useState } from 'react'
import { useListarEmails } from './useListarEmails'

export function useFiltroListaGeral() {
  const { emails, loading, refresh } = useListarEmails()
  const [q, setQ] = useState('')
  const [debounced, setDebounced] = useState('')
  const [dataIni, setDataIni] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 300)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => { setPage(1) }, [debounced, dataIni, dataFim])

  const filtered = useMemo(() => {
    return emails
      .filter(e => debounced ? (
        e.remetente.toLowerCase().includes(debounced.toLowerCase()) ||
        e.destinatario.toLowerCase().includes(debounced.toLowerCase()) ||
        (e.assunto ?? '').toLowerCase().includes(debounced.toLowerCase())
      ) : true)
      .filter(e => dataIni ? (new Date(e.dataHora) >= new Date(dataIni)) : true)
      .filter(e => dataFim ? (new Date(e.dataHora) <= new Date(dataFim)) : true)
  }, [emails, debounced, dataIni, dataFim])

  const start = (page - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)

  return {
    emails,
    loading,
    refresh,
    q,
    setQ,
    debounced,
    dataIni,
    setDataIni,
    dataFim,
    setDataFim,
    filtered,
    page,
    setPage,
    pageSize,
    pageItems,
  }
}
