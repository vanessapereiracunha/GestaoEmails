export interface Estado {
  id: number
  sigla: string
  nome: string
}

export interface Municipio {
  id: number
  nome: string
}

const ESTADOS_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
const MUNICIPIOS_URL = (uf: string) => `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`

let estadosCache: Estado[] | null = null
const municipiosCache = new Map<string, Municipio[]>()

export async function fetchEstados(): Promise<Estado[]> {
  if (estadosCache) return estadosCache
  const resp = await fetch(ESTADOS_URL)
  if (!resp.ok) throw new Error('Falha ao carregar estados do IBGE')
  const data = await resp.json() as any[]
  estadosCache = data
    .map(e => ({ id: e.id as number, sigla: String(e.sigla), nome: String(e.nome) }))
    .sort((a, b) => a.sigla.localeCompare(b.sigla))
  return estadosCache
}

export async function fetchMunicipios(uf: string): Promise<Municipio[]> {
  if (!uf) return []
  const cached = municipiosCache.get(uf)
  if (cached) return cached
  const resp = await fetch(MUNICIPIOS_URL(uf))
  if (!resp.ok) throw new Error('Falha ao carregar municípios do IBGE')
  const data = await resp.json() as any[]
  const municipios = data
    .map(m => ({ id: m.id as number, nome: String(m.nome) }))
    .sort((a, b) => a.nome.localeCompare(b.nome))
  municipiosCache.set(uf, municipios)
  return municipios
}