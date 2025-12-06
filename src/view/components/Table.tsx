export function Table({ children, className = '' }: { children: React.ReactNode, className?: string }){
  return <div className={`overflow-auto rounded-lg border bg-white shadow-sm max-h-[60vh] ${className}`}>{children}</div>
}

export function TTable({ children }: { children: React.ReactNode }){
  return <table className="min-w-full text-sm text-slate-800">{children}</table>
}

export function THead({ children }: { children: React.ReactNode }){
  return <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10">{children}</thead>
}

export function TRow({ children }: { children: React.ReactNode }){
  return <tr className="border-t even:bg-slate-50/50">{children}</tr>
}

type TCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & { header?: boolean }

export function TCell({ children, header = false, className = '', ...rest }: TCellProps){
  const base = header ? 'py-2 px-3 text-left font-medium text-slate-600' : 'py-2 px-3 text-slate-800'
  return <td className={`${base} ${className}`} {...rest}>{children}</td>
}
