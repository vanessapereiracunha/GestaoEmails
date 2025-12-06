import { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <div className="h-16 border-b border-white/5 bg-slate-900/60 backdrop-blur flex items-center px-6 lg:px-10">
          <div className="flex-1 flex items-center justify-between text-xs text-slate-400">
            <span>Sistema de Gestão de E-mails</span>
            <span className="hidden sm:inline">IFPI • Hackaton 2025</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
