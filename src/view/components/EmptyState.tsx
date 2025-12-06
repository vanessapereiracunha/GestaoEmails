export default function EmptyState({ title = 'Sem dados', description }: { title?: string, description?: string }){
  return (
    <div className="rounded-lg border bg-white p-6 text-center text-slate-600">
      <div className="text-sm font-medium text-slate-900 mb-1">{title}</div>
      {description && <div className="text-sm">{description}</div>}
    </div>
  )
}
