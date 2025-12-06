import { useToast } from '../../state/toast'

export default function ToastContainer(){
  const { toasts, remove } = useToast()
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(t=> (
        <div key={t.id} className={
          `min-w-[260px] max-w-sm rounded-md border p-3 shadow bg-slate-900/95 text-slate-50 ${
            t.variant === 'success' ? 'border-emerald-400' : t.variant === 'error' ? 'border-red-400' : 'border-slate-600'
          }`
        }>
          {t.title && <div className="font-medium text-slate-50">{t.title}</div>}
          {t.description && <div className="text-sm text-slate-200">{t.description}</div>}
          <button className="mt-2 text-xs text-slate-400 hover:text-slate-200 hover:underline" onClick={()=>remove(t.id)}>Fechar</button>
        </div>
      ))}
    </div>
  )
}
