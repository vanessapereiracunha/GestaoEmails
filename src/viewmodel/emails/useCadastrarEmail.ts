import { useEmailsContext } from '../../state/emails'
import type { CreateEmailDto } from '../../model/create-email.dto'

export function useCadastrarEmail() {
  const { createManual } = useEmailsContext()
  return { cadastrar: (dto: CreateEmailDto) => createManual(dto) }
}
