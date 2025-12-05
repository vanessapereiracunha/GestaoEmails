import { useEmailsContext } from '../../state/emails'
import type { CreateEmailDto } from '../../types/create-email.dto'

export function useCadastrarEmail() {
  const { createManual } = useEmailsContext()
  return { cadastrar: (dto: CreateEmailDto) => createManual(dto) }
}
