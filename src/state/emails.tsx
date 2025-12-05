import { createContext, useContext, useMemo, useState } from 'react'
import type { Email } from '../types/email'
import type { CreateEmailDto } from '../types/create-email.dto'
import { emailService } from '../services/emailService'

interface EmailsContextValue {
  emails: Email[]
  pendentes: Email[]
  loading: boolean
  refresh(): Promise<void>
  createManual(dto: CreateEmailDto): Promise<Email>
  classificar(id: string, uf: string | null, municipio: string | null): Promise<void>
}

const EmailsContext = createContext<EmailsContextValue | undefined>(undefined)

export function EmailsProvider({ children }: { children: React.ReactNode }) {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(false)

  async function refresh() {
    setLoading(true)
    try { setEmails(await emailService.listAll()) } finally { setLoading(false) }
  }

  async function createManual(dto: CreateEmailDto) {
    const created = await emailService.createManual(dto)
    await refresh()
    return created
  }

  async function classificar(id: string, uf: string | null, municipio: string | null) {
    await emailService.classificar(id, uf, municipio)
    await refresh()
  }

  const pendentes = useMemo(()=> emails.filter(e=>!e.classificado), [emails])

  const value: EmailsContextValue = { emails, pendentes, loading, refresh, createManual, classificar }
  return <EmailsContext.Provider value={value}>{children}</EmailsContext.Provider>
}

export function useEmailsContext() {
  const ctx = useContext(EmailsContext)
  if (!ctx) throw new Error('useEmailsContext must be used inside EmailsProvider')
  return ctx
}
