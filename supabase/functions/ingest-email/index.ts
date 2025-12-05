import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const url = Deno.env.get('SUPABASE_URL')
const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const client = url && key ? createClient(url, key) : null

export async function handler(req: Request): Promise<Response> {
  if (!client) return new Response('config', { status: 500 })
  let body: any
  try { body = await req.json() } catch { return new Response('bad', { status: 400 }) }
  const remetente = body.from || body.sender || ''
  const destinatario = Array.isArray(body.to) ? String(body.to[0]||'') : (body.to || '')
  const assunto = body.subject || ''
  const corpo = body.text || body.html || ''
  const dataHora = body.date ? new Date(body.date).toISOString() : new Date().toISOString()
  const { error } = await client.from('emails').insert({ remetente, destinatario, assunto, corpo, dataHora, classificado: false })
  if (error) return new Response('db', { status: 500 })
  return new Response('ok', { status: 201 })
}

Deno.serve(handler)
