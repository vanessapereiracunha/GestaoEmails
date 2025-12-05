# Hackaton - Sistema de Gestão de E-mails

Stack: React + TypeScript (Vite), TailwindCSS, Supabase (Postgres). Arquitetura em camadas com interfaces, baixo acoplamento e hooks/contexts para o app.

## Estrutura

- src/
  - pages/: Dashboard, Pendentes, CadastroManual, ListaGeral, Detalhes
  - hooks/: useDashboard e hooks de emails (listar, classificar, cadastrar)
  - contexts/: EmailsProvider
  - services/: httpClient, supabase, emailService (interface + implementação), dashboardService
  - types/: modelos e DTOs

## Executar

1. Copie `.env.example` para `.env` e defina as variáveis:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

2. Instale dependências e rode o dev server:
```
npm install
npm run dev
```

Acesse http://localhost:5173

## Banco (Supabase)
Crie a tabela `emails` (SQL sugerido):
```sql
create table if not exists public.emails (
  id uuid primary key default gen_random_uuid(),
  remetente text not null,
  destinatario text not null,
  assunto text,
  corpo text,
  dataHora timestamptz not null default now(),
  uf text,
  municipio text,
  classificado boolean not null default false
);
create index if not exists idx_emails_pendentes on public.emails(classificado);
```

Observação: o app funciona mesmo sem Supabase (fallback em memória). Para persistir, configure o `.env`.

### Migrações
Há um arquivo `migrations/schema.sql` contendo o DDL acima, para versionamento do banco.

## Scripts
- `npm run dev` - ambiente de desenvolvimento
- `npm run build` - build de produção
- `npm run preview` - preview local do build
- `npm run typecheck` - checagem de tipos

## Notas
- UI responsiva com Tailwind. Gráficos simples no Dashboard (barras minimalistas).
- Camadas separadas e interfaces em `services` para baixo acoplamento.
- Sem comentários adicionados para cumprir a diretriz solicitada.

## Integração Gmail (oficial) para ingestão automática
Use a função Edge `supabase/functions/gmail-poll` para captar e-mails via Gmail API e gravar na tabela.

1. Google Cloud Console
- Crie um projeto. Habilite Gmail API.
- Configure OAuth consent screen.
- Crie credenciais OAuth 2.0 (Client ID/Secret).

2. Obter refresh token
- Use o OAuth Playground ou um script para autorizar o escopo do Gmail e gerar o `refresh_token`.
- Guarde: `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`.

3. Variáveis de ambiente (no Supabase)
- Em Project Settings → Configuration → Environment Variables, defina:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GMAIL_CLIENT_ID`
  - `GMAIL_CLIENT_SECRET`
  - `GMAIL_REFRESH_TOKEN`
  - `GMAIL_USER` (ex.: seu-email@gmail.com ou `me`)
  - `GMAIL_QUERY` (ex.: `cc:cc-do-sistema@seu-dominio.com newer_than:2d`)

4. Deploy e agendamento
- Faça deploy da Edge Function `gmail-poll` e agende via Scheduled Edge Functions (ex.: a cada 5 minutos).
- A função busca mensagens que combinem a query, lê metadados (From/To/Subject/Date/snippet) e insere em `public.emails`.

5. Observações
- Os arquivos da pasta `supabase/functions` usam Deno. Erros no editor sobre `Deno`/imports são esperados localmente e não impactam no deploy na Supabase.
- No frontend, apenas `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` vão no `.env` local. As variáveis sensíveis do Gmail e `SERVICE_ROLE_KEY` devem ficar no painel do Supabase.
