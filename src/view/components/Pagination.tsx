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
    <div className="flex items-center justify-center gap-4 text-sm">
      <button
        disabled={!canPrev}
        onClick={() => goto(page - 1)}
        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
      >
        Anterior
      </button>
      <span className="text-slate-600 min-w-[120px] text-center">
        Página {page} de {pages}
      </span>
      <button
        disabled={!canNext}
        onClick={() => goto(page + 1)}
        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
      >
        Próxima
      </button>
    </div>
  )
}
