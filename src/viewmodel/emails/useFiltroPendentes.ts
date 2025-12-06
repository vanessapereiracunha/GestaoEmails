import { useEffect, useMemo, useState } from 'react'
import { useListarEmails } from './useListarEmails'

export function useFiltroPendentes() {
  const { emails, loading, refresh } = useListarEmails()
  const [remetente, setRemetente] = useState('')
  const [dataIni, setDataIni] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => { setPage(1) }, [remetente, dataIni, dataFim])

  const pendentes = useMemo(() => {
    return emails
      .filter(e => !e.classificado)
      .filter(e => remetente ? e.remetente.toLowerCase().includes(remetente.toLowerCase()) : true)
      .filter(e => dataIni ? (new Date(e.dataHora) >= new Date(dataIni)) : true)
      .filter(e => dataFim ? (new Date(e.dataHora) <= new Date(dataFim)) : true)
  }, [emails, remetente, dataIni, dataFim])

  const start = (page - 1) * pageSize
  const pageItems = pendentes.slice(start, start + pageSize)
  const totalPages = Math.ceil(pendentes.length / pageSize) || 1

  return {
    emails,
    pendentes,
    loading,
    refresh,
    remetente,
    setRemetente,
    dataIni,
    setDataIni,
    dataFim,
    setDataFim,
    page,
    setPage,
    pageSize,
    pageItems,
    totalPages,
  }
}
