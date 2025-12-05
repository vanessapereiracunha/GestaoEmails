import { Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface BadgeStatusProps {
  status: string
}

export default function BadgeStatus({ status }: BadgeStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pendente':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-300',
          icon: Clock,
          label: 'Pendente'
        }
      case 'classificado':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-300',
          icon: CheckCircle,
          label: 'Classificado'
        }
      case 'erro':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-300',
          icon: AlertCircle,
          label: 'Erro'
        }
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-300',
          icon: Clock,
          label: status
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
      <Icon size={14} />
      {config.label}
    </span>
  )
}
