import { createContext, useContext, useState } from 'react'

export type Toast = { id: string, title?: string, description?: string, variant?: 'success'|'error'|'info' }

type Ctx = {
  toasts: Toast[]
  push: (t: Omit<Toast,'id'>) => void
  remove: (id: string) => void
}

const ToastContext = createContext<Ctx | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }){
  const [toasts, setToasts] = useState<Toast[]>([])

  function push(t: Omit<Toast,'id'>){
    const toast: Toast = { id: crypto.randomUUID(), ...t }
    setToasts(prev => [...prev, toast])
    setTimeout(()=> remove(toast.id), 4000)
  }
  function remove(id: string){ setToasts(prev => prev.filter(t=> t.id !== id)) }

  return (
    <ToastContext.Provider value={{ toasts, push, remove }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(){
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
