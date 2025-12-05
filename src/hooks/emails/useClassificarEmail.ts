import { useEmailsContext } from '../../state/emails'

export function useClassificarEmail() {
  const { classificar } = useEmailsContext()
  return { classificar }
}
