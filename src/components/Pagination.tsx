type Props = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, pageSize, total, onPageChange }: Props){
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const canPrev = page > 1
  const canNext = page < pages

  function goto(p: number){
    if (p < 1 || p > pages) return
    onPageChange(p)
  }

  return (
    <div className="flex items-center justify-end gap-2 text-sm">
      <button disabled={!canPrev} onClick={()=>goto(page-1)} className="px-2 py-1 rounded border bg-white disabled:opacity-50">Anterior</button>
      <span className="text-slate-600">Página {page} de {pages}</span>
      <button disabled={!canNext} onClick={()=>goto(page+1)} className="px-2 py-1 rounded border bg-white disabled:opacity-50">Próxima</button>
    </div>
  )
}
