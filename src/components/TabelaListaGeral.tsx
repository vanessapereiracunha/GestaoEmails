import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import BadgeStatus from './BadgeStatus'

interface TabelaListaGeralProps {
  emails: Array<{
    id: string
    remetente: string
    destinatario: string
    dataHora: string
    uf?: string
    municipio?: string
    classificado: boolean
  }>
  paginaAtual: number
  totalPaginas: number
  onVisualizar: (id: string) => void
  onEditar: (id: string) => void
  onExcluir: (id: string) => void
  onPaginaAnterior: () => void
  onPaginaProxima: () => void
}

export default function TabelaListaGeral({
  emails,
  paginaAtual,
  totalPaginas,
  onVisualizar,
  onEditar,
  onExcluir,
  onPaginaAnterior,
  onPaginaProxima
}: TabelaListaGeralProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Cabeçalho da tabela */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-7 gap-4 text-sm font-semibold text-gray-700">
          <div>Remetente</div>
          <div>Destinatário</div>
          <div>Data</div>
          <div>UF</div>
          <div>Município</div>
          <div>Status</div>
          <div>Ações</div>
        </div>
      </div>

      {/* Corpo da tabela */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        {emails.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {emails.map((email) => (
              <div
                key={email.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="grid grid-cols-7 gap-4 items-center">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {email.remetente}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {email.destinatario}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(email.dataHora).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {email.uf || '—'}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {email.municipio || '—'}
                  </div>
                  <div>
                    <BadgeStatus status={email.classificado ? 'classificado' : 'pendente'} />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onVisualizar(email.id)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                      title="Visualizar"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEditar(email.id)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onExcluir(email.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <div className="text-sm">Nenhum e-mail encontrado</div>
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
