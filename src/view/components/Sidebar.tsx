import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  MailCheck, 
  PlusCircle, 
  Mailbox,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

interface MenuItemProps {
  to: string
  icon: React.ReactNode
  children: React.ReactNode
}

function MenuItem({ to, icon, children }: MenuItemProps) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) => `
        flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200 border border-transparent
        ${isActive 
          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-400/60 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]' 
          : 'text-slate-300 hover:text-white hover:bg-slate-800/70 hover:border-slate-700'
        }
      `}
    >
      <span className="shrink-0 text-slate-300">{icon}</span>
      <span className="truncate">{children}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
    { to: '/pendentes', icon: <MailCheck size={20} />, text: 'Pendentes' },
    { to: '/cadastro', icon: <PlusCircle size={20} />, text: 'Cadastro Manual' },
    { to: '/lista', icon: <Mailbox size={20} />, text: 'Lista Geral' },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-slate-900/80 text-slate-100 rounded-xl shadow-lg border border-white/10 backdrop-blur"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-68 bg-slate-950/70
        border-r border-white/10 shadow-[0_0_60px_rgba(15,23,42,0.9)] backdrop-blur-xl
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-5 pt-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg">
                <Mailbox size={20} className="text-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-50 tracking-tight">MailPulse</span>
                <span className="text-[11px] text-slate-400">Gestão de envios</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 pt-4 pb-4 space-y-1 overflow-y-auto">
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 px-2 mb-1">Navegação</div>
            {menuItems.map((item) => (
              <MenuItem key={item.to} to={item.to} icon={item.icon}>
                {item.text}
              </MenuItem>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/10 bg-slate-950/70">
            <div className="rounded-xl border border-slate-700/80 bg-slate-900/60 px-3 py-3 text-[11px] text-slate-400">
              <div className="flex items-center justify-between mb-1">
                <span className="uppercase tracking-[0.14em] text-slate-500">Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-300 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>Sync Gmail</span>
                <span className="text-slate-500">Edge Function</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
