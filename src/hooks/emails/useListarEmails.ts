import { useEffect } from 'react'
import { useEmailsContext } from '../../state/emails'

export function useListarEmails() {
  const { emails, loading, refresh } = useEmailsContext()
  useEffect(()=>{ refresh() }, [])
  return { emails, loading, refresh }
}
