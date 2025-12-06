# Sistema de Gestão de E-mails – IFPI Hackathon

Sistema web para **gestão, classificação e análise de e-mails institucionais**, com foco em:

- Ingestão automática via **Gmail API** (cron/polling).
- Armazenamento em **Supabase/Postgres**.
- Dashboard analítico.
- Classificação por **UF e município** usando dados oficiais do **IBGE**.
- UI em **React + TypeScript + Vite + TailwindCSS**, organizada em um **MVVM leve**.

> **Importante:** este repositório contém **apenas o código-fonte** do frontend e das Edge Functions. 
> O backend é **100% serverless** em cima do **Supabase**; por isso, **quem clonar o projeto precisa criar e configurar o próprio projeto no Supabase e no Google Cloud**. Nenhuma chave privada está incluída aqui.

---

## Visão Geral

### Objetivo do sistema

Centralizar e estruturar e-mails institucionais que hoje chegam em uma caixa de entrada caótica, permitindo:

- Visualizar indicadores (totais, classificados, pendentes, por UF, por dia).
- Classificar e-mails por localidade (UF/município).
- Acompanhar pendências e histórico.
- Cadastrar e-mails manualmente quando necessário.

### Principais diferenciais (para hackathon)

- Integração real com **Gmail API** e **Supabase Edge Functions** (backend serverless).
- Arquitetura organizada em **camadas + MVVM leve**, fácil de explicar e evoluir.
- Separação clara entre:
  - `view` (UI),
  - `viewmodel` (hooks de orquestração),
  - `services` (regra de negócio + acesso a dados),
  - `model` (tipos),
  - `state` (contextos globais),
  - `utils` (helpers).
- Fluxo ponta‑a‑ponta funcionando, não apenas telas mockadas.
- Tratamento de erros, loading states, EmptyStates e toasts.

---

## Arquitetura Geral

### Tecnologias principais

- **Frontend**
  - React + TypeScript + Vite
  - TailwindCSS
  - react-router-dom
  - react-chartjs-2 + chart.js

- **Backend serverless**
  - Supabase (Postgres)
  - Supabase Edge Functions (Deno) para integração com Gmail
  - Supabase CLI para deploy

- **Automação**
  - Chamadas periódicas à Edge Function `gmail-poll` via cron externo ou GitHub Actions (opcional).

---

## Por que este repositório não roda automaticamente ao clonar

Este projeto foi pensado para um cenário real de produção/hackathon, com **integração a serviços externos**. 
Por questões de segurança e boas práticas, **nenhuma chave privada** ou configuração sensível é armazenada no repositório.

Para rodar o sistema, você **precisa ter**:

- Um projeto próprio no **Supabase** (Postgres + Edge Functions).
- Um projeto próprio no **Google Cloud** com **Gmail API** habilitada.
- Credenciais OAuth (client id/secret) e `refresh_token` do Gmail.
- Variáveis de ambiente configuradas **no Supabase** (Edge Functions) e **no `.env` do frontend**.

Sem essas configurações, o frontend até sobe (`npm run dev`), mas:

- Não consegue se conectar ao banco (sem `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`).
- As Edge Functions (`gmail-poll`, `ingest-email`) não conseguem falar com Gmail nem com o Postgres.

Esta é uma **decisão de arquitetura proposital**: o repositório é seguro para ser aberto/publicado, e cada pessoa cria seu próprio ambiente de backend.

---

## Estrutura de Pastas

```text
src/
  view/
    pages/          # Páginas: Dashboard, Pendentes, ListaGeral, CadastroManual, Detalhes
    components/     # Componentes visuais reutilizáveis (Layout, Sidebar, Tabelas, Cards, Badges, Skeleton, ToastContainer, etc.)
  viewmodel/
    dashboard/      # Hooks de orquestração do dashboard (ex: useDashboard)
    emails/         # Hooks de e-mails: listar, cadastrar, classificar, filtros, paginação (ex: useListarEmails, useFiltroPendentes)
  model/
    email.ts        # Tipo Email, DTOs para criação
    dashboard.ts    # Tipo DashboardResumo, estruturas para gráficos
    ...             # Outros modelos conforme necessidade
  state/
    emails.tsx      # Contexto global de e-mails (lista e ações: listar, criar, classificar)
    toast.tsx       # Contexto global de toasts (mensagens de sucesso/erro)
  services/
    supabase.ts     # Cliente do Supabase
    emailService.ts # Operações de e-mail (CRUD, classificação) sobre o Postgres/Supabase
    dashboardService.ts # Cálculo de métricas para o dashboard
    ibgeService.ts  # Consulta a estados e municípios via API IBGE
    httpClient.ts   # Utilitário de requisição (se necessário)
  utils/
    csv.ts          # Geração e download de CSV

supabase/
  functions/
    gmail-poll/     # Edge Function que integra com Gmail e grava em public.emails
    ingest-email/   # Edge Function genérica para ingestão via webhook
  migrations/
    schema.sql      # DDL do banco (emails, municipios, índices)

.github/
  workflows/
    gmail-poll.yml  # (Opcional) Workflow que chama gmail-poll periodicamente
```

---

## Arquitetura em Camadas + MVVM leve

### Camadas

1. **View (UI) – `src/view`**
   - `pages/`: telas da aplicação (Dashboard, Pendentes, Lista Geral, Detalhes, Cadastro Manual).
   - `components/`: componentes visuais (botões, tabelas, cards, layout, skeletons, etc.).
   - Responsabilidade: **apresentação** e interação com o usuário (JSX).

2. **ViewModel – `src/viewmodel`**
   - Hooks que orquestram:
     - Chamada de services.
     - Estado de tela (loading, filtros, paginação).
     - Tratamento de erros com toasts.
   - Exemplos:
     - `dashboard/useDashboard`
     - `emails/useListarEmails`, `useCadastrarEmail`, `useClassificarEmail`
     - `emails/useFiltroPendentes`, `useFiltroListaGeral`

3. **Services – `src/services`**
   - Contêm a lógica de negócio e acesso a dados.
   - Não sabem nada sobre React.
   - Exemplos:
     - `emailService`: listar, criar, classificar e-mails.
     - `dashboardService`: calcular totais, pendentes, classificados, por UF, tendência 7 dias, top destinatários.
     - `ibgeService`: buscar estados e municípios.

4. **State (Contextos globais) – `src/state`**
   - `emails.tsx`: provê `EmailsProvider` e hook para acessar lista de e‑mails e ações.
   - `toast.tsx`: provê `ToastProvider` e hook `useToast` para disparar mensagens.

5. **Model – `src/model`**
   - Define tipos e DTOs usados em várias camadas.
   - Evita duplicar estruturas e aumenta a segurança de tipos.

6. **Utils – `src/utils`**
   - Funções puras auxiliares (como CSV), reutilizáveis entre camadas.

### Diagrama MVVM (ASCII)

```text
         ┌─────────────────────┐
         │       view          │
         │  (pages/components) │
         └─────────┬───────────┘
                   │ usa hooks
                   ▼
          ┌──────────────────┐
          │    viewmodel     │
          │   (hooks TS)     │
          └────────┬─────────┘
           chama   │
                   ▼
        ┌────────────────────┐
        │      services      │
        │ (email, dashboard, │
        │   ibge, supabase)  │
        └────────┬───────────┘
                 │ usa tipos
                 ▼
           ┌─────────────┐
           │    model     │
           └─────────────┘

        ┌────────────────────┐
        │       state        │
        │ (EmailsProvider,   │
        │  ToastProvider)    │
        └────────────────────┘
```

---

## Backend: Supabase + Edge Functions + Polling

### Banco de dados

- Postgres gerenciado pelo Supabase.
- Tabelas principais:
  - `municipios` (nome, uf_sigla).
  - `emails`:
    - `id`, `remetente`, `destinatario`, `assunto`, `corpo`, `"dataHora"`.
    - `uf`, `municipio` (texto – usado hoje).
    - `uf_sigla`, `municipio_id` (normalizados – prontos para relatórios futuros).
    - `classificado` (boolean).

### Edge Function `gmail-poll`

Local: `supabase/functions/gmail-poll/index.ts`.

Responsabilidades:

- Ler envs:
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`
  - `GMAIL_USER`, `GMAIL_QUERY`
- Pedir `access_token` ao Google via OAuth2.
- Consultar a Gmail API (`messages.list` + `messages.get`) com `GMAIL_QUERY` (ex.: `to:sistema@dominio.com newer_than:2d`).
- Para cada mensagem:
  - Ler `From`, `To`, `Subject`, `Date`, `snippet`/corpo.
  - Verificar duplicidade simples (combinação remetente/destinatário/assunto/data).
  - Inserir em `public.emails` com `classificado = false`.

### Edge Function `ingest-email`

Local: `supabase/functions/ingest-email/index.ts`.

Responsabilidades:

- Receber POST com JSON (webhook de email provider, por exemplo).
- Mapear campos (`from`, `to`, `subject`, `text`/`html`, `date`).
- Inserir em `public.emails`.

### Polling com cron job (por que não só webhook)

- **Polling (cron + `gmail-poll`)**
  - Uma chamada a cada X minutos (ex.: 1 ou 2 minutos).
  - Vantagens:
    - Não depende de configuração complexa de webhooks no Gmail.
    - Recupera e-mails mesmo se o cron falhar em algum momento (no próximo ciclo ele busca todos os "newer_than").
    - Mais simples de depurar: é só chamar a função manualmente.
- **Webhook (`ingest-email`)**
  - Excelente para outros provedores que suportam webhooks nativos.
  - No fluxo atual, a prioridade foi a integração oficial com Gmail via polling.

### Diagrama do fluxo de ingestão (ASCII)

```text
┌──────────────┐        ┌──────────────────────┐        ┌───────────────────┐
│   cron job   │  HTTP  │  Edge Function       │  SQL   │   Supabase DB     │
│ (externo ou  ├───────►│  gmail-poll          ├───────►│  (Postgres)       │
│ GitHub Acts) │        │ (Supabase)           │        │  tabela emails    │
└──────────────┘        └──────────────────────┘        └───────────────────┘
                                                            ▲
                                                            │
                                                            │ select *
                                         ┌──────────────────┴───────────────┐
                                         │    Frontend React (services)     │
                                         │    emailService / dashboard      │
                                         └──────────────────────────────────┘
```

---

## Backend serverless e forma de execução

O backend deste sistema é **100% serverless**, baseado em:

- **Supabase Postgres** para armazenamento.
- **Supabase Edge Functions** (runtime Deno) para integração com Gmail.

Não há servidor Node próprio, nem backend hospedado no mesmo repositório. Em vez disso:

- As Edge Functions são implantadas no Supabase.
- O cron (por exemplo, `cron-job.org`) chama a URL pública da função `gmail-poll`.
- O frontend React se conecta **diretamente** ao Postgres gerenciado pelo Supabase (usando a ANON KEY, com RLS/schemas adequados).

Isso significa que **o código só funciona plenamente** quando:

1. Você tem um projeto Supabase criado.
2. Rodou as migrações (`schema.sql`).
3. Implantou as Edge Functions (`gmail-poll`, `ingest-email`).
4. Configurou as variáveis de ambiente sensíveis no Supabase.

O frontend pode rodar localmente **usando um Supabase remoto**, sem precisar de backend local.

---

## Fluxos principais do sistema

### Dashboard

- **Fonte de dados:** `dashboardService` (frontend) + `emailService.listAll`.
- **Cálculos:**
  - Total de e‑mails.
  - Classificados vs pendentes.
  - Por UF (agrupamento por `uf`).
  - Tendência últimos 7 dias (agrupamento por dia).
  - Top destinatários.
- **Exibição:**
  - Cards com métricas.
  - Gráficos de barras/linha com `react-chartjs-2`.
  - Lista de top destinatários.
- **Arquitetura:**
  - `viewmodel/useDashboard` chama `dashboardService.resumo()`.
  - Tratamento de loading + erro com Skeletons + EmptyState + toasts.

### Pendentes + Classificação por UF/Município

- **Página:** `view/pages/Pendentes.tsx`
- **Lógica de filtro/paginação:** `viewmodel/emails/useFiltroPendentes`.
- **Fluxo:**
  - Carrega e‑mails pendentes via contexto/global e services.
  - Permite filtrar por remetente e data.
  - Faz paginação da lista.
  - Cada linha permite classificar UF e município (usando dados do IBGE).
- **Ferramentas:**
  - Tabela com actions.
  - Botão para exportar CSV dos pendentes.
  - Toasts em caso de sucesso/erro na classificação.

### Lista Geral (Histórico)

- **Página:** `view/pages/ListaGeral.tsx`
- **Lógica:** `viewmodel/emails/useFiltroListaGeral`.
- **Filtros:**
  - Busca por remetente, destinatário ou assunto.
  - Filtro por intervalo de datas.
  - Paginação.
- **EmptyState** explica quando não há resultados com os filtros atuais.

### Cadastro Manual

- **Página:** `view/pages/CadastroManual.tsx`
- **Fluxo:**
  - Formulário com:
    - remetente, destinatário, assunto, corpo, data/hora, UF, município.
  - Carrega estados/municípios do IBGE.
  - Envia dados via `useCadastrarEmail` (que usa `EmailsProvider` + `emailService`).
  - Exibe toasts de sucesso/erro.
- **Uso típico:** registrar e-mail que chegou por outro canal ou corrigir dados.

### Detalhes do E-mail

- **Página:** `view/pages/Detalhes.tsx`
- **Fluxo:**
  - Busca e-mail por ID via `emailService.getById`.
  - Exibe remetente, destinatário, data/hora, assunto, corpo, UF, município.
  - Permite editar UF e município, recarregando lista de municípios com base na UF.
  - Toasts de sucesso/erro ao salvar.

---

## Testabilidade futura

- **Services** (`emailService`, `dashboardService`):
  - São bons candidatos para testes unitários.
  - Podem ser testados com dados mockados e/ou Supabase mock.
- **Viewmodels** (`useDashboard`, `useListarEmails`, `useFiltro*`):
  - Podem ser testados com mocks de services/state.
  - Lógica clara de loading, erro e dados.

### Como a arquitetura ajuda

- A separação View → ViewModel → Services → Model permite:
  - Testar `dashboardService` isoladamente com arrays de e‑mails mock.
  - Testar `emailService` trocando o client Supabase por um mock.
  - Testar hooks de viewmodel usando mocks de services/toasts.

---

## Segurança das chaves

- No frontend (`Vite`), somente:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Chaves sensíveis:
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`
  - Ficam em:
    - Secrets do Supabase (Edge Functions).
    - Secrets do GitHub Actions (se usado).
- O frontend **nunca** recebe service role key nem chaves do Gmail.

---

## Por que essa arquitetura funciona bem

- **Baixo acoplamento:**
  - UI (React) não sabe detalhes de Supabase/Gmail; fala com services.
- **Escalabilidade de features:**
  - Novas telas ou gráficos podem reutilizar `emailService`/`dashboardService`.
- **Evolução para produção:**
  - Fácil adicionar testes, monitoramento, autenticação.
- **Infra mínima:**
  - Edge Functions + Supabase evitam manter um servidor próprio.
- **Perfeita para hackathon:**
  - Entrega valor real com pouco overhead de infraestrutura.
  - Fácil de explicar e demonstrar.

---

## Futuros aprimoramentos

- Adicionar testes unitários em `dashboardService` e `emailService`.
- Adicionar testes de hooks em `useDashboard` e `useListarEmails`.
- Melhorar observabilidade das Edge Functions (logs, métricas).
- Evoluir a normalização de `uf_sigla` e `municipio_id` no frontend.
- Implementar autenticação de usuários e papéis (ex: administrador, operador).
- Refinar acessibilidade (a11y) e identidade visual.

---

## Como rodar o projeto do zero (passo a passo completo)

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repositorio>
cd GestaoEmails
npm install
```

### 2. Configurar variáveis de ambiente do frontend (React + Vite)

Crie `.env` na raiz com:

```bash
VITE_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
VITE_SUPABASE_ANON_KEY=<ANON_KEY_DO_SUPABASE>
```

### 3. Criar projeto no Supabase e rodar migrações

No painel do Supabase:

1. Crie um projeto no Supabase.
2. No SQL Editor do Supabase, abra o conteúdo de `supabase/migrations/schema.sql` deste repositório.
3. Execute o script inteiro.
4. Verifique se as tabelas `emails`, `municipios` (e demais estruturas) foram criadas.

> Você pode rodar o SQL tanto pelo painel web quanto via Supabase CLI – o README assume o uso do painel para simplificar.

### 4. Ativar a Gmail API e criar credenciais no Google Cloud

1. Crie um projeto no Google Cloud Console.
2. Habilite **Gmail API**.
3. Configure **OAuth consent screen**.
4. Crie credenciais OAuth 2.0 (Client ID + Client Secret).
5. Garante que você tem um `GMAIL_USER` (e-mail que será monitorado).
6. Obtenha um `refresh_token` para o Gmail (via **OAuth Playground**, por exemplo).

Anote:

- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `GMAIL_REFRESH_TOKEN`
- `GMAIL_USER` (e-mail monitorado – conta do sistema)
- `GMAIL_QUERY` (ex.: `cc:meusistema@gmail.com newer_than:2d`)

#### Como gerar um `refresh_token` usando o OAuth Playground

1. Acesse: https://developers.google.com/oauthplayground
2. Clique em **OAuth 2.0 Configuration** (engrenagem) e marque "Use your own OAuth credentials".
3. Insira `GMAIL_CLIENT_ID` e `GMAIL_CLIENT_SECRET` que você criou no Google Cloud.
4. No campo de scopes, use algo como: `https://mail.google.com/`.
5. Clique em **Authorize APIs** e faça login com a **conta do sistema** (não a de colaborador, para respeitar o edital).
6. Após autorizar, clique em **Exchange authorization code for tokens**.
7. Copie o `refresh_token` gerado e salve como `GMAIL_REFRESH_TOKEN`.

### 5. Configurar Edge Functions e segredos no Supabase

No painel do Supabase, em **Project Settings → Edge Functions → Secrets**:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `GMAIL_REFRESH_TOKEN`
- `GMAIL_USER`
- `GMAIL_QUERY`

Deploy das functions (via Supabase CLI):

```bash
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
npx supabase functions deploy gmail-poll
npx supabase functions deploy ingest-email
```

### 6. (Opcional) Configurar cron externo

- Agende chamadas periódicas para:

```text
POST https://<PROJECT_REF>.supabase.co/functions/v1/gmail-poll
Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
```

Isso pode ser feito via:

*   **cron-job.org** (recomendado e simples).
*   Outro scheduler de sua escolha.

### 7. Rodar o frontend em desenvolvimento

```bash
npm run dev
```

Abra: `http://localhost:5173`.

---

## Como testar localmente usando apenas o frontend + Supabase remoto

- O frontend React roda localmente com `npm run dev`.
- O Supabase (Postgres + Edge Functions) roda na nuvem.
- Esse é o fluxo recomendado:

1. Configure `.env` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` do seu projeto Supabase.
2. Garanta que o schema (`schema.sql`) já foi aplicado no projeto.
3. Implante as Edge Functions ou desabilite temporariamente a ingestão automática e cadastre e-mails manualmente para testar a UI.
4. Rode `npm run dev` e acesse `http://localhost:5173`.

Você conseguirá testar:

- Dashboard (com dados que já estiverem na tabela `emails`).
- Pendentes, Lista Geral, Cadastro Manual, Detalhes.

---

## Como testar as Edge Functions pelo dashboard do Supabase

1. No painel do Supabase, vá em **Edge Functions**.
2. Selecione `gmail-poll`.
3. Use o botão **Invoke** para chamar manualmente a função.
4. Veja os **logs** para acompanhar erros de configuração (ex.: falta de `GMAIL_USER`, `GMAIL_QUERY`, etc.).
5. Após a execução, verifique na tabela `emails` se novos registros foram inseridos.

Para `ingest-email`:

1. Vá na função `ingest-email`.
2. Use **Invoke** com um body JSON, por exemplo:

```json
{
  "from": "colaborador@empresa.com",
  "to": ["cliente@dominio.com"],
  "subject": "Teste",
  "text": "Corpo de teste",
  "date": "2025-12-06T10:00:00Z"
}
```

3. Verifique se o registro aparece em `emails`.

---

## Como usar sua própria conta pessoal do Gmail

A ingestão automática funciona com **qualquer conta Gmail**, desde que:

- Você crie um projeto no Google Cloud.
- Ative a Gmail API e configure OAuth para essa conta.
- Gere um `refresh_token` para essa conta.
- Configure as variáveis no Supabase (`GMAIL_USER`, `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, `GMAIL_QUERY`).

Para uso pessoal (sem restrições do edital), você pode usar um `GMAIL_QUERY` simples, por exemplo:

```text
to:seuemail@gmail.com newer_than:7d
```

Ou ainda filtrar por assunto, rótulo, etc. conforme a sintaxe da Gmail API.

---

## Como adaptar para e-mail institucional

No contexto institucional (como no edital do hackathon), a regra é:

- Colaboradores enviam e-mails ao cliente **com cópia (CC) para o e-mail do sistema**.
- O sistema **só deve ingerir** e-mails onde o e-mail do sistema aparece em `Cc`.

Isso é configurado de duas maneiras:

1. **Na query do Gmail** (`GMAIL_QUERY`):
   ```text
   cc:meusistema@gmail.com newer_than:7d
   ```
2. **Na Edge Function `gmail-poll`**: o código já verifica se o e-mail do sistema aparece em `Cc` antes de inserir no banco.

Se quiser adaptar para um e-mail institucional (ex.: `sistema@empresa.com.br`):

- Configure `GMAIL_USER = sistema@empresa.com.br`.
- Configure `GMAIL_QUERY = cc:sistema@empresa.com.br newer_than:7d`.
- Gere o `refresh_token` logando com essa conta institucional no OAuth Playground.

---

## Checklist para replicar o sistema

1. **Clonar o repositório**
   - `git clone ... && cd GestaoEmails && npm install`.

2. **Criar projeto no Supabase**
   - Anotar `SUPABASE_URL`, `SERVICE_ROLE_KEY`, `ANON_KEY`.

3. **Rodar `schema.sql` no Supabase**
   - Conferir tabelas `emails`, `municipios`.

4. **Criar projeto no Google Cloud e ativar Gmail API**
   - Criar credenciais OAuth 2.0.

5. **Gerar `refresh_token` no OAuth Playground**
   - Com a conta de e-mail que será monitorada.

6. **Configurar segredos das Edge Functions no Supabase**
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, `GMAIL_USER`, `GMAIL_QUERY`.

7. **Deploy das Edge Functions**
   - `npx supabase functions deploy gmail-poll`.
   - `npx supabase functions deploy ingest-email` (opcional).

8. **(Opcional) Configurar cron (ex.: cron-job.org)**
   - Chamar periodicamente a URL da `gmail-poll`.

9. **Configurar `.env` do frontend**
   - `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

10. **Rodar o frontend**
    - `npm run dev` e acessar `http://localhost:5173`.

---

## Scripts Disponíveis

- `npm run dev` – desenvolvimento
- `npm run build` – build de produção
- `npm run preview` – preview local do build
- `npm run typecheck` – checagem de tipos TypeScript

---

## Melhorias de UI/UX – Recomendações Técnicas

### Padronização visual profissional

- **Spacing**
  - Usar padrão consistente de espaçamentos verticais:
    - `section` principal: `py-8` ou `py-10`.
    - Espaço entre seções: `mb-8`.
  - Manter `max-w-7xl mx-auto` como largura máxima em páginas principais.

- **Hierarquia**
  - `h1`: `text-3xl font-bold text-gray-900`.
  - `h2`: `text-lg font-semibold text-gray-900`.
  - Legendas/labels: `text-sm text-gray-600`.

- **Grids**
  - Dashboard: `grid-cols-1 md:grid-cols-3` para cards; `grid-cols-1 lg:grid-cols-2` para gráficos.

### Variação entre páginas (evitar tudo igual)

- Dashboard:
  - Fundo levemente diferente (`bg-gray-50`) + cards e gráficos em `bg-white`.
- Pendentes:
  - Destaque maior para tabela e botão “Exportar CSV”.
- Lista Geral:
  - Destaque para barra de filtros/busca com borda e fundo `bg-white`.
- Detalhes:
  - Layout mais “card de ficha” com seções bem separadas.
- Cadastro Manual:
  - Formulário em card largo com título grande, remetendo a “wizard”.

### Componentes visuais avançados

- **Cards**
  - `rounded-2xl` e `shadow-sm` com leves `hover:shadow-md`.
- **Headers**
  - Incluir subtítulo pequeno abaixo do `h1` explicando a tela.
- **Sidebar**
  - Ícones com labels claros, indicação de rota ativa usando `border-l-4` e fundo `bg-indigo-50`.
- **Breadcrumbs**
  - Ex.: em Detalhes:
    - `Dashboard / Lista geral / Detalhes do e-mail`.
- **Tags de status**
  - Usar Badges coloridos (ex.: `bg-green-100 text-green-700` para “Classificado”, `bg-indigo-100 text-indigo-700` para “Pendente”).
- **Gráficos**
  - Paleta consistente:
    - Azul para totais.
    - Verde para classificados.
    - Laranja para pendentes.

### Microinterações

- Skeletons:
  - Já existem; pode adicionar `animate-pulse` para dar sensação de carregamento.
- Hovers:
  - Botões principais com:
    - `transition-colors duration-150 ease-out`.
    - Escurecer levemente a cor no hover.
- Feedback imediato:
  - Desabilitar botões enquanto operação está em progresso (`disabled:opacity-50` + `cursor-not-allowed`).

### Responsividade aprimorada

- Garantir colunas responsivas em formulários (`grid-cols-1 lg:grid-cols-2`).
- Em tabelas:
  - Em telas muito pequenas, permitir scroll horizontal com `overflow-x-auto`.
- Em dashboards:
  - Empilhar gráficos verticalmente em mobile.

### Identidade visual (sugestão)

- **Paleta**
  - Primária: `indigo-600`, `indigo-700`.
  - Secundária: `sky-500`, `sky-600`.
  - Fundo neutro: `gray-50`, `gray-100`.
  - Textos: `gray-900` (principal), `gray-600` (secundário).

- **Tipografia**
  - Usar fonte sem serifa padrão (ex.: Inter, system font).
  - Destaque grande em `h1`, negrito e tracking leve.

---

## Tabela: Layout Atual x Layout Melhorado (proposta)

| Aspecto                | Layout atual                                      | Layout melhorado (proposta)                                  |
|------------------------|---------------------------------------------------|--------------------------------------------------------------|
| Headers                | Títulos simples                                   | Título + subtítulo explicando a tela                         |
| Cards                  | `rounded-lg`, sombra leve                         | `rounded-2xl`, sombra suave, hovers sutis                    |
| Sidebar                | Navegação funcional                               | Indicação visual clara da rota ativa + ícones consistentes   |
| Breadcrumbs            | Ausentes                                          | Presente em Detalhes e outras rotas profundas                |
| Gráficos               | Cores básicas                                     | Paleta consistente entre dashboard e demais telas            |
| Skeletons              | Já existem                                        | Adicionar `animate-pulse` e variações de forma                |
| Estados de botão       | Hover simples                                     | Hover/active mais marcados, desabilitados bem sinalizados    |
| Responsividade         | Boa                                               | Ajustes finos em tabelas e cards para mobile bem polido      |

---

## Plano de melhorias – 1 dia (rápido)

- Ajustar headers com subtítulos em todas as páginas.
- Adicionar `animate-pulse` aos Skeletons.
- Padronizar Badges de status com cores consistentes.
- Melhorar indicadores de rota ativa na sidebar.
- Revisar textos de EmptyState e mensagens de erro (tom e clareza).

## Plano de melhorias – 1 semana (completo)

- Extrair mais subcomponentes de layout (Header, Breadcrumb, PageContainer).
- Criar um pequeno “design system” interno de:
  - Botões,
  - Cards,
  - Badges,
  - Inputs.
- Refinar responsividade de tabelas com `overflow-x-auto` e colunas colapsáveis em mobile.
- Aplicar uma paleta e tipografia mais personalizada (podendo incluir uma fonte externa).
- Adicionar microanimações sutis (entradas de cards, toasts, etc.).

---

## Diferenciais técnicos (para a banca)

- Backend totalmente baseado em **Supabase Edge Functions** → backend serverless simples de manter e escalar.
- Frontend em **React + TypeScript + MVVM leve**, facilmente testável e extensível.
- **Separação clara de camadas**:
  - View (UI),
  - ViewModel (hooks),
  - Services (lógica de negócio),
  - State (contexto),
  - Model (tipos),
  - Utils (helpers).
- Fluxo de ingestão resiliente usando **polling com cron**:
  - Independente de webhooks funcionarem ou não.
  - Recupera e-mails retroativos via filtros `newer_than`.
- Pronto para testes unitários em `services` e `viewmodel` usando mocks:
  - Não é necessário reescrever para adicionar testes.
- README e documentação robustos, descrevendo:
  - Setup,
  - Arquitetura,
  - Segurança,
  - Possíveis evoluções.

---

## Notas finais

- UI responsiva com Tailwind, gráficos com `react-chartjs-2` + `chart.js`.
- Arquitetura em camadas com services e hooks para baixo acoplamento.
- Edge Functions em Deno; avisos no editor sobre `Deno`/imports são esperados localmente e não impedem o deploy.
- No frontend, apenas `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` vão no `.env`. Variáveis sensíveis (Gmail, `SERVICE_ROLE_KEY`) ficam no painel do Supabase ou nos secrets do GitHub.
