import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useCadastrarEmail } from '../hooks/emails/useCadastrarEmail'
import { useToast } from '../state/toast'
import { fetchEstados, fetchMunicipios } from '../services/ibgeService'

export default function CadastroManual(){
  const { cadastrar } = useCadastrarEmail()
  const { push } = useToast()
  const [ufs, setUfs] = useState<{ sigla: string, nome: string }[]>([])
  const [municipios, setMunicipios] = useState<string[]>([])
  const [ufSelecionada, setUfSelecionada] = useState('')

  useEffect(()=> {
    fetchEstados()
      .then(estados => setUfs(estados.map(e=>({ sigla: e.sigla, nome: e.nome }))))
      .catch(()=>{})
  }, [])

  useEffect(()=> {
    if (!ufSelecionada) { setMunicipios([]); return }
    fetchMunicipios(ufSelecionada)
      .then(ms => setMunicipios(ms.map(m=>m.nome)))
      .catch(()=>{})
  }, [ufSelecionada])

  async function onSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    try {
      await cadastrar({
        remetente: String(fd.get('remetente')||''),
        destinatario: String(fd.get('destinatario')||''),
        assunto: String(fd.get('assunto')||''),
        corpo: String(fd.get('corpo')||''),
        dataHora: new Date(String(fd.get('dataHora')||new Date().toISOString())).toISOString(),
        uf: String(fd.get('uf')||'') || null,
        municipio: String(fd.get('municipio')||'') || null,
      })
      form.reset()
      push({ variant: 'success', title: 'E-mail cadastrado', description: 'O envio manual foi registrado com sucesso.' })
    } catch (err: any) {
      push({ variant: 'error', title: 'Erro ao cadastrar', description: err?.message || 'Tente novamente.' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Novo E-mail Manual</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 pb-16">
          <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-base font-medium text-gray-700 mb-2">Remetente</label>
              <input name="remetente" placeholder="joao@empresa.com" className="border rounded-lg px-4 py-3 w-full text-base" required />
            </div>
            <div className="col-span-2">
              <label className="block text-base font-medium text-gray-700 mb-2">Destinatário</label>
              <input name="destinatario" placeholder="cliente@dominio.com" className="border rounded-lg px-4 py-3 w-full text-base" required />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Data / Hora</label>
              <input type="datetime-local" name="dataHora" className="border rounded-lg px-4 py-3 w-full text-base" />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Assunto</label>
              <input name="assunto" placeholder="Assunto" className="border rounded-lg px-4 py-3 w-full text-base" />
            </div>
            <div className="col-span-2">
              <label className="block text-base font-medium text-gray-700 mb-2">Corpo da Mensagem</label>
              <textarea name="corpo" placeholder="Escreva a mensagem..." className="border rounded-lg px-4 py-3 w-full text-base" rows={8} />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Estado (UF)</label>
              <select
                name="uf"
                className="border rounded-lg px-4 py-3 w-full text-base"
                value={ufSelecionada}
                onChange={e=> setUfSelecionada(e.target.value)}
              >
                <option value="">Selecione</option>
                {ufs.map(uf=> <option key={uf.sigla} value={uf.sigla}>{uf.sigla} - {uf.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Município</label>
              <select name="municipio" className="border rounded-lg px-4 py-3 w-full text-base disabled:bg-gray-100" disabled={!ufSelecionada || municipios.length===0}>
                <option value="">Selecione</option>
                {municipios.map(m=> <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="col-span-2 flex gap-3 justify-end mt-12">
              <button type="button" className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-base">
                Cancelar
              </button>
              <button type="submit" className="px-6 py-3 rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-700 transition-colors text-base">
                Salvar E-mail
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
