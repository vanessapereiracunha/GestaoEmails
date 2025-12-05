export interface CreateEmailDto {
  remetente: string
  destinatario: string
  assunto?: string
  corpo?: string
  dataHora: string // ISO
  uf?: string | null
  municipio?: string | null
}
