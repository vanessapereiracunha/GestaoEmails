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
        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }
      `}
    >
      {icon}
      <span className="font-medium">{children}</span>
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-900 text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Mailbox size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Gestão de E-mails</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <MenuItem key={item.to} to={item.to} icon={item.icon}>
                {item.text}
              </MenuItem>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 text-center">
              Sistema de Gestão v1.0
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
