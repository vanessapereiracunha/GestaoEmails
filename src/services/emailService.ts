import { getSupabase } from './supabase'
import type { Email } from '../model/email'
import type { CreateEmailDto } from '../model/create-email.dto'

export interface IEmailService {
  listAll(): Promise<Email[]>
  listPendentes(): Promise<Email[]>
  createManual(dto: CreateEmailDto): Promise<Email>
  classificar(id: string, uf: string | null, municipio: string | null): Promise<void>
  getById(id: string): Promise<Email | null>
}

class SupabaseEmailService implements IEmailService {
  async listAll(): Promise<Email[]> {
    const supabase = getSupabase()
    if (!supabase) return memory.listAll()
    const { data, error } = await supabase.from('emails').select('*').order('dataHora', { ascending: false })
    if (error) throw error
    return (data as any[]) as Email[]
  }
  async listPendentes(): Promise<Email[]> {
    const supabase = getSupabase()
    if (!supabase) return memory.listPendentes()
    const { data, error } = await supabase.from('emails').select('*').eq('classificado', false).order('dataHora', { ascending: false })
    if (error) throw error
    return (data as any[]) as Email[]
  }
  async createManual(dto: CreateEmailDto): Promise<Email> {
    const supabase = getSupabase()
    if (!supabase) return memory.createManual(dto)
    const { data, error } = await supabase.from('emails').insert({ ...dto, classificado: !!(dto.uf && dto.municipio) }).select('*').single()
    if (error) throw error
    return data as Email
  }
  async classificar(id: string, uf: string | null, municipio: string | null): Promise<void> {
    const supabase = getSupabase()
    if (!supabase) return memory.classificar(id, uf, municipio)
    const { error } = await supabase.from('emails').update({ uf, municipio, classificado: !!(uf && municipio) }).eq('id', id)
    if (error) throw error
  }
  async getById(id: string): Promise<Email | null> {
    const supabase = getSupabase()
    if (!supabase) return memory.getById(id)
    const { data, error } = await supabase.from('emails').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return (data as Email) ?? null
  }
}

// In-memory fallback (dev/demo)
const memoryData: Email[] = []

const memory: IEmailService = {
  async listAll() { return [...memoryData].sort((a,b)=>b.dataHora.localeCompare(a.dataHora)) },
  async listPendentes() { return (await this.listAll()).filter(e=>!e.classificado) },
  async createManual(dto) {
    const e: Email = {
      id: crypto.randomUUID(),
      remetente: dto.remetente,
      destinatario: dto.destinatario,
      assunto: dto.assunto,
      corpo: dto.corpo,
      dataHora: dto.dataHora,
      uf: dto.uf ?? null,
      municipio: dto.municipio ?? null,
      classificado: !!(dto.uf && dto.municipio),
    }
    memoryData.push(e)
    return e
  },
  async classificar(id, uf, municipio) {
    const idx = memoryData.findIndex(e=>e.id===id)
    if (idx>=0) {
      memoryData[idx] = { ...memoryData[idx], uf, municipio, classificado: !!(uf && municipio) }
    }
  },
  async getById(id) { return memoryData.find(e=>e.id===id) ?? null },
}

export const emailService: IEmailService = new SupabaseEmailService()
