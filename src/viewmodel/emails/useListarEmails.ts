import { useEffect } from 'react'
import { useEmailsContext } from '../../state/emails'
import { useToast } from '../../state/toast'

export function useListarEmails() {
  const { emails, loading, refresh } = useEmailsContext()
  const { push } = useToast()

  useEffect(() => {
    (async () => {
      try {
        await refresh()
      } catch (err: any) {
        push({
          variant: 'error',
          title: 'Erro ao carregar e-mails',
          description: err?.message || 'Não foi possível carregar a lista de e-mails. Tente novamente.',
        })
      }
    })()
  }, [])
  return { emails, loading, refresh }
}
