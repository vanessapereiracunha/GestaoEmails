import { ChevronLeft, ChevronRight } from 'lucide-react'
import LinhaEmailPendente from './LinhaEmailPendente'

interface TabelaPendentesProps {
  emails: Array<{
    id: string
    remetente: string
    destinatario: string
    dataHora: string
    uf?: string
    municipio?: string
  }>
  paginaAtual: number
  totalPaginas: number
  onSalvar: (id: string, uf: string, municipio: string) => void
  salvando?: boolean
  onPaginaAnterior: () => void
  onPaginaProxima: () => void
}

export default function TabelaPendentes({
  emails,
  paginaAtual,
  totalPaginas,
  onSalvar,
  salvando = false,
  onPaginaAnterior,
  onPaginaProxima
}: TabelaPendentesProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Cabeçalho da tabela */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-gray-700">
          <div>Remetente</div>
          <div>Destinatário</div>
          <div>Data</div>
          <div>Local</div>
          <div>Classificar</div>
        </div>
      </div>

      {/* Corpo da tabela */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        {emails.length > 0 ? (
          <table className="w-full">
            <tbody>
              {emails.map((email) => (
                <LinhaEmailPendente
                  key={email.id}
                  email={email}
                  onSalvar={onSalvar}
                  salvando={salvando}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <div className="text-sm">Nenhum e-mail pendente encontrado</div>
          </div>
        )}
      </div>

      {/* Paginação */}
      {emails.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={onPaginaAnterior}
              disabled={paginaAtual === 1}
              className="h-10 px-4 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              Anterior
            </button>
            
            <div className="text-sm text-gray-600">
              Página {paginaAtual} de {totalPaginas}
            </div>
            
            <button
              onClick={onPaginaProxima}
              disabled={paginaAtual === totalPaginas}
              className="h-10 px-4 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center gap-2"
            >
              Próxima
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
