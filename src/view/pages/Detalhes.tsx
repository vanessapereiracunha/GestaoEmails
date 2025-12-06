import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Email } from '../../model/email'
import { emailService } from '../../services/emailService'
import { useToast } from '../../state/toast'
import { fetchEstados, fetchMunicipios } from '../../services/ibgeService'

export default function Detalhes(){
  const { id } = useParams()
  const [email, setEmail] = useState<Email | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { push } = useToast()

  async function load(){
    if (!id) return
    setLoading(true)
    try { setEmail(await emailService.getById(id)) } finally { setLoading(false) }
  }

  useEffect(()=>{ load() }, [id])

  async function onEditLocal(fd: FormData){
    if (!email) return
    setSaving(true)
    try {
      const uf = (fd.get('uf') as string) || null
      const municipio = (fd.get('municipio') as string) || null
      await emailService.classificar(email.id, uf, municipio)
      await load()
      push({ variant: 'success', title: 'Local atualizado', description: 'UF e município salvos com sucesso.' })
    } catch (err: any) {
      push({
        variant: 'error',
        title: 'Erro ao salvar local',
        description: err?.message || 'Não foi possível salvar UF e município. Tente novamente.',
      })
    } finally { setSaving(false) }
  }

  if (loading) return <div className="text-sm text-slate-200">Carregando detalhes do e-mail...</div>
  if (!email) return <div className="text-sm text-slate-200">E-mail não encontrado.</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">Detalhes do E-mail</h1>

      <div className="rounded-lg border bg-white p-5 shadow-sm space-y-2 text-slate-900">
        <Row label="Remetente" value={email.remetente} />
        <Row label="Destinatário" value={email.destinatario} />
        <Row label="Data" value={new Date(email.dataHora).toLocaleString()} />
        <Row label="Assunto" value={email.assunto ?? '–'} />
        <Row label="Localização" value={`${email.uf ?? '–'} - ${email.municipio ?? '–'}`} />
      </div>

      <div className="rounded-lg border bg-white p-5 shadow-sm text-slate-900">
        <h2 className="font-medium mb-3 text-slate-900">Editar Local</h2>
        <EditLocalForm
          defaultUF={email.uf ?? ''}
          defaultMunicipio={email.municipio ?? ''}
          onSubmit={(f)=> onEditLocal(f)}
          saving={saving}
        />
      </div>

      <div className="rounded-lg border bg-white p-5 shadow-sm text-slate-900">
        <h2 className="font-medium mb-2 text-slate-900">Mensagem</h2>
        <div className="whitespace-pre-wrap text-sm text-slate-800">{email.corpo ?? 'Sem corpo'}</div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string, value: string }){
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="col-span-2 text-slate-900">{value}</div>
    </div>
  )
}

function EditLocalForm({ defaultUF, defaultMunicipio, onSubmit, saving }:{ defaultUF: string, defaultMunicipio: string, onSubmit: (fd: FormData)=>void, saving: boolean }){
  const [ufs, setUfs] = useState<{ sigla: string, nome: string }[]>([])
  const [ufSelecionada, setUfSelecionada] = useState(defaultUF)
  const [municipios, setMunicipios] = useState<string[]>([])

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

  function handle(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSubmit(fd)
  }
  return (
    <form onSubmit={handle} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
      <div>
        <label className="block text-sm text-slate-600 mb-1">UF</label>
        <select
          name="uf"
          className="border rounded-md px-3 py-2 w-full bg-white text-slate-900"
          value={ufSelecionada}
          onChange={e=> setUfSelecionada(e.target.value)}
        >
          <option value="">Selecione</option>
          {ufs.map(uf=> <option key={uf.sigla} value={uf.sigla}>{uf.sigla} - {uf.nome}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm text-slate-600 mb-1">Município</label>
        <select
          name="municipio"
          className="border rounded-md px-3 py-2 w-full bg-white text-slate-900 disabled:bg-slate-100"
          defaultValue={defaultMunicipio}
          disabled={!ufSelecionada || municipios.length===0}
        >
          <option value="">Selecione</option>
          {municipios.map(m=> <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <button disabled={saving} className="px-4 py-2 rounded-md bg-blue-600 text-white shadow hover:bg-blue-700 disabled:opacity-50">{saving ? 'Salvando...' : 'Salvar'}</button>
      </div>
    </form>
  )
}
