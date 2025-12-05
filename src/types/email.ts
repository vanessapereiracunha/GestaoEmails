export interface Email {
  id: string
  remetente: string
  destinatario: string
  assunto?: string
  corpo?: string
  dataHora: string // ISO
  uf?: string | null
  municipio?: string | null
  classificado: boolean
}
