// Supabase Edge Function: Poll Gmail API to ingest emails matching a query
// Requires env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_USER, GMAIL_QUERY
// Recommended to run on a schedule (Supabase Scheduled Edge Functions) or via manual HTTP trigger.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const client = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

const GMAIL_CLIENT_ID = Deno.env.get('GMAIL_CLIENT_ID')
const GMAIL_CLIENT_SECRET = Deno.env.get('GMAIL_CLIENT_SECRET')
const GMAIL_REFRESH_TOKEN = Deno.env.get('GMAIL_REFRESH_TOKEN')
const GMAIL_USER = Deno.env.get('GMAIL_USER') || 'me'
const GMAIL_QUERY = Deno.env.get('GMAIL_QUERY') || '' // ex: cc:inbox@suaempresa.com newer_than:1d

async function getAccessToken() {
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GMAIL_CLIENT_ID ?? '',
      client_secret: GMAIL_CLIENT_SECRET ?? '',
      refresh_token: GMAIL_REFRESH_TOKEN ?? '',
      grant_type: 'refresh_token',
    }),
  })
  if (!resp.ok) throw new Error('token: ' + resp.status)
  const json = await resp.json()
  return json.access_token as string
}

async function listMessageIds(accessToken: string) {
  const qs = new URLSearchParams({ q: GMAIL_QUERY, maxResults: '20' })
  const resp = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${encodeURIComponent(GMAIL_USER)}/messages?${qs}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!resp.ok) throw new Error('list: ' + resp.status)
  const json = await resp.json()
  return (json.messages ?? []) as Array<{ id: string }>
}

async function getMessage(accessToken: string, id: string) {
  const resp = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${encodeURIComponent(GMAIL_USER)}/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!resp.ok) throw new Error('get: ' + resp.status)
  return await resp.json()
}

function headerValue(payload: any, name: string): string | null {
  const h = (payload?.headers ?? []).find((x: any) => x.name?.toLowerCase() === name.toLowerCase())
  return h?.value ?? null
}

async function upsertEmailFromGmail(msg: any) {
  const remetente = headerValue(msg.payload, 'From') ?? ''
  const destinatario = headerValue(msg.payload, 'To') ?? ''
  const assunto = headerValue(msg.payload, 'Subject') ?? ''
  const date = headerValue(msg.payload, 'Date')
  const dataHora = date ? new Date(date).toISOString() : new Date().toISOString()
  const corpo = msg.snippet ?? ''
  const idExt = msg.id

  // naive de-duplication by external id stored in a dedicated column if you add it
  // For now, try to avoid exact duplicates by same sender+recipient+date+subject
  const { data: exists, error: existsErr } = await client!
    .from('emails')
    .select('id')
    .eq('remetente', remetente)
    .eq('destinatario', destinatario)
    .eq('assunto', assunto)
    .eq('dataHora', dataHora)
    .limit(1)

  if (!existsErr && exists && exists.length > 0) return

  const { error } = await client!
    .from('emails')
    .insert({ remetente, destinatario, assunto, corpo, dataHora, classificado: false })

  if (error) throw error
}

export default async function handler(req: Request): Promise<Response> {
  try {
    if (!client || !GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
      return new Response('config', { status: 500 })
    }
    const token = await getAccessToken()
    const ids = await listMessageIds(token)
    for (const m of ids) {
      const full = await getMessage(token, m.id)
      await upsertEmailFromGmail(full)
    }
    return new Response(JSON.stringify({ ok: true, processed: ids.length }), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response('error: ' + (e as Error).message, { status: 500 })
  }
}

// Serve HTTP (allow manual trigger or schedule)
Deno.serve(handler)
