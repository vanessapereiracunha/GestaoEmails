# Hackaton - Sistema de Gestão de E-mails

Sistema web para **gestão, classificação e análise de e-mails** recebidos por um endereço institucional.

Principais funcionalidades:

- **Ingestão automática** de e-mails via Gmail API.
- Persistência em **Supabase/Postgres**.
- Interface web em **React + TypeScript + Vite + TailwindCSS**.
- Dashboard com gráficos, listas, filtros, paginação, exportação CSV e toasts.

Stack principal: React, TypeScript (Vite), TailwindCSS, Supabase (Postgres), Supabase Edge Functions (Deno), GitHub Actions.

---

## Arquitetura e organização do projeto

### Estrutura de pastas

- `src/`
  - `pages/`: Dashboard, Pendentes, CadastroManual, ListaGeral, Detalhes
  - `components/`: Layout, Sidebar, Tabelas, Cards, Botões, Badges, Skeleton, ToastContainer, etc.
  - `hooks/`: `useDashboard` e hooks de emails (listar, classificar, cadastrar)
  - `state/`: estado global para e-mails e toasts
  - `services/`: `httpClient`, `supabase`, `emailService`, `dashboardService`, `ibgeService`
  - `types/`: modelos e DTOs (Email, Dashboard, User, CreateEmailDto)
  - `utils/`: utilitários (ex.: CSV)

- `supabase/`
  - `functions/`
    - `gmail-poll/`: Edge Function que consulta a Gmail API e grava em `public.emails`
    - `ingest-email/`: Edge Function genérica para ingestão via webhook
  - `migrations/`
    - `schema.sql`: DDL completo do banco (tabelas e índices)

- `.github/`
  - `workflows/gmail-poll.yml`: workflow do GitHub Actions que chama periodicamente a função `gmail-poll`

**Decisão:** separar frontend (`src`), backend Supabase (`supabase`) e automação (`.github`) facilita a leitura, a manutenção e mostra claramente onde está cada responsabilidade.

---

## Arquitetura em camadas (Layered Architecture)

A aplicação segue uma **arquitetura em camadas** no frontend, com responsabilidades bem definidas e baixo acoplamento entre as camadas.

### Camadas

1. **Camada de Apresentação (UI)**
   - `src/pages/` – telas da aplicação (Dashboard, Pendentes, Lista Geral, etc.).
   - `src/components/` – componentes reutilizáveis (Botões, Tabelas, Cards, Badges, etc.).
   - Hooks de UI que orquestram interações com o estado e serviços.

2. **Camada de Estado (State Management)**
   - `src/state/emails.tsx` – estado global da lista de e‑mails e ações (listar, criar, classificar).
   - `src/state/toast.tsx` – estado e contêiner de notificações/toasts.
   - Expor apenas o necessário para as camadas superiores, sem acesso direto ao banco.

3. **Camada de Serviços (Business / Infra)**
   - `src/services/emailService.ts` – interface + implementação para operações de e‑mails.
   - `src/services/dashboardService.ts` – agregações para os gráficos.
   - `src/services/supabase.ts` – cliente do banco.
   - `src/services/httpClient.ts` – utilitário genérico para chamadas HTTP.

4. **Camada de Dados (Data Access)**
   - Supabase (Postgres) como banco de dados.
   - Supabase Edge Functions (`gmail-poll`, ` ingest-email`) para integração com APIs externas.

### Por que essa arquitetura?

- **Baixo acoplamento:** cada camada depende apenas da camada inferior. Se o banco mudar, só os serviços precisam ser ajustados.
- **Alta coesão:** cada camada tem uma única responsabilidade (UI, estado, regras de negócio, dados).
- **Manutenibilidade:** facilitar correções de bugs e adição de funcionalidades sem espalhar lógica.
- **Testabilidade:** é possível testar serviços e hooks isoladamente, sem depender da UI.
- **Escalabilidade:** novas features (ex: integração com outro provedor de e‑mail) podem ser adicionadas na camada de serviços sem mexer nas páginas.

---

## Banco de dados (Supabase / Postgres)

O schema está versionado em `supabase/migrations/schema.sql`.

### Tabelas

```sql
-- Tabela de unidades federativas (UFs)
create table if not exists public.ufs (
  sigla char(2) primary key,
  nome  text    not null
);

-- Tabela de municípios, vinculados a uma UF
create table if not exists public.municipios (
  id       bigserial primary key,
  nome     text      not null,
  uf_sigla char(2)   not null references public.ufs(sigla)
);

-- Tabela principal de e-mails
create table if not exists public.emails (
  id uuid primary key default gen_random_uuid(),
  remetente text not null,
  destinatario text not null,
  assunto text,
  corpo text,
  "dataHora" timestamptz not null default now(),
  -- colunas text simples usadas atualmente pela aplicação
  uf text,
  municipio text,
  -- colunas normalizadas opcionais (para uso futuro / queries mais ricas)
  uf_sigla char(2) references public.ufs(sigla),
  municipio_id bigint references public.municipios(id),
  classificado boolean not null default false
);

create index if not exists idx_emails_classificado on public.emails(classificado);
create index if not exists idx_emails_datahora on public.emails("dataHora" desc);
create index if not exists idx_emails_uf_sigla on public.emails(uf_sigla);
create index if not exists idx_emails_municipio_id on public.emails(municipio_id);
```

**Decisões de modelagem:**

- Começar com uma tabela única `emails` permitiu entregar mais rápido.
- Em seguida, foram criadas tabelas normalizadas (`ufs` e `municipios`) para uma modelagem mais correta, mantendo compatibilidade com o frontend através das colunas `uf` e `municipio` em texto.
- As colunas `uf_sigla` e `municipio_id` são opcionais, preparadas para queries e relatórios mais ricos no futuro.

---

## Tecnologias e justificativas

- **React + TypeScript + Vite**
  - React: base consolidada para SPAs e ecossistema maduro.
  - TypeScript: segurança de tipos, melhor manutenção em um código com várias camadas (services, state, pages).
  - Vite: dev server rápido e build otimizado, com configuração mínima.

- **TailwindCSS**
  - Permite criar uma UI moderna rapidamente com classes utilitárias.
  - Facilita manter padrão de tipografia, cores e espaçamento.

- **Supabase (Postgres + Edge Functions)**
  - Banco Postgres gerenciado com painel visual simples.
  - Edge Functions em Deno, ideais para integrar com APIs externas (Gmail) sem criar outro backend.

- **Gmail API (OAuth2)**
  - Integração oficial, estável e segura.
  - Permite filtros avançados (`q=`) e acesso a metadados de mensagens.

- **GitHub Actions**
  - Usado como scheduler para chamar a função de ingestão (`gmail-poll`) em intervalos regulares.

---

## Fluxo de ingestão de e-mails (Gmail API)

### Edge Function `gmail-poll`

Local: `supabase/functions/gmail-poll/index.ts`.

Responsabilidades:

- Ler variáveis de ambiente:
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`
  - `GMAIL_USER`, `GMAIL_QUERY`
- Obter um `access_token` da Google a partir do `refresh_token`.
- Consultar a Gmail API com o filtro definido em `GMAIL_QUERY` (ex.: `to:sistema@dominio.com newer_than:2d`).
- Para cada mensagem retornada:
  - Buscar metadados (`From`, `To`, `Subject`, `Date`, `snippet`).
  - Evitar duplicatas simples por combinação de remetente/destinatário/assunto/data.
  - Inserir na tabela `public.emails` com `classificado = false`.

### Edge Function `ingest-email`

Local: `supabase/functions/ingest-email/index.ts`.

Responsabilidades:

- Receber JSON de provedores de e-mail (webhook inbound) com campos como `from`, `to`, `subject`, `text`, `html`, `date`.
- Mapear os campos e inserir em `public.emails`.
- Retornar status `201 ok` em caso de sucesso.

**Decisão:** separar ingestão via Gmail oficial (`gmail-poll`) de ingestão genérica (`ingest-email`) aumenta a flexibilidade para integrações futuras sem alterar o frontend.

---

## Automação via GitHub Actions

Workflow: `.github/workflows/gmail-poll.yml`.

### Gatilhos

```yaml
on:
  schedule:
    - cron: '*/2 * * * *'  # a cada 2 minutos
  workflow_dispatch:       # permite executar manualmente
```

- `schedule`: executa automaticamente a cada 2 minutos.
- `workflow_dispatch`: permite rodar manualmente pelo botão "Run workflow".

### Job principal

```yaml
jobs:
  poll:
    runs-on: ubuntu-latest
    steps:
      - name: Call Gmail Poll Function
        run: |
          curl -X POST '${{ secrets.SUPABASE_URL }}/functions/v1/gmail-poll' \
            -H 'Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}' \
            -H 'Content-Type: application/json' \
            -d '{}'
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

Secrets necessários no repositório GitHub:

- `SUPABASE_URL` – URL do projeto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` – chave service_role (apenas no GitHub e nas Edge Functions; nunca no frontend).

**Fluxo final:** o GitHub Actions chama periodicamente a função `gmail-poll`, que busca novos e-mails no Gmail e atualiza a tabela `emails`. O frontend reflete as mudanças automaticamente nas telas.

---

## Executar o projeto (passo a passo)

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repositorio>
cd GestaoEmails
npm install
```

### 2. Configurar variáveis de ambiente do frontend

Copie `.env.example` para `.env` e preencha:

```bash
VITE_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
VITE_SUPABASE_ANON_KEY=<ANON_KEY_DO_SUPABASE>
```

### 3. Configurar o banco no Supabase

No painel do Supabase:

- Crie um projeto.
- No SQL Editor, execute o conteúdo de `supabase/migrations/schema.sql`.
- Verifique no Table Editor se as tabelas `emails`, `ufs` e `municipios` foram criadas.

### 4. Configurar Gmail API (Google Cloud)

- Crie um projeto no Google Cloud Console.
- Habilite **Gmail API**.
- Configure **OAuth consent screen**.
- Crie **credenciais OAuth 2.0** (Client ID e Client Secret).
- Gere um `refresh_token` para o escopo do Gmail (ex.: via OAuth Playground).

Anote:

- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `GMAIL_REFRESH_TOKEN`
- `GMAIL_USER` (e-mail monitorado)
- `GMAIL_QUERY` (ex.: `to:seu-email@dominio.com newer_than:2d`)

### 5. Configurar variáveis de ambiente das Edge Functions (Supabase)

No painel do Supabase, em **Project Settings → Edge Functions → Secrets**:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `GMAIL_REFRESH_TOKEN`
- `GMAIL_USER`
- `GMAIL_QUERY`

Depois disso, faça o deploy das functions (via Supabase CLI):

```bash
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
npx supabase functions deploy gmail-poll
npx supabase functions deploy ingest-email
```

### 6. Configurar GitHub Actions (opcional mas recomendado)

No repositório GitHub:

- Vá em **Settings → Secrets and variables → Actions** e crie:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

O workflow `Gmail Poll` passará a rodar automaticamente a cada 2 minutos.

### 7. Rodar o frontend em desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:5173`.

---

## Scripts disponíveis

- `npm run dev` – ambiente de desenvolvimento
- `npm run build` – build de produção (gera pasta `dist`)
- `npm run preview` – preview local do build de produção
- `npm run typecheck` – checagem de tipos TypeScript

---

## Notas finais

- UI responsiva com Tailwind, gráficos com `react-chartjs-2` + `chart.js`.
- Arquitetura em camadas com services e hooks para baixo acoplamento.
- Edge Functions em Deno; avisos no editor sobre `Deno`/imports são esperados localmente e não impedem o deploy.
- No frontend, apenas `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` vão no `.env`. Variáveis sensíveis (Gmail, `SERVICE_ROLE_KEY`) ficam no painel do Supabase ou nos secrets do GitHub.
