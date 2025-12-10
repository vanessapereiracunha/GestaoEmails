# 📧 Sistema de Gestão de E-mails – IFPI Hackathon

Sistema web desenvolvido para ingestão, classificação e análise de e-mails institucionais, com integração real à Gmail API e backend 100% serverless em Supabase.

- Demo online: [https://gestao-emails.vercel.app/](https://gestao-emails.vercel.app/)
- Este repositório contém somente o frontend e as Edge Functions.
- Para rodar localmente, você precisa criar seu próprio ambiente Supabase + Google Cloud.

## 🚀 Visão Geral

### 🎯 Objetivo
- Organizar e centralizar e-mails institucionais que chegam de forma desestruturada, permitindo:
- Visualizar indicadores e gráficos.
- Classificar e-mails por UF e município (dados oficiais do IBGE).
- Acompanhar pendências e histórico.
- Inserir e-mails manualmente.

### ✨ Destaques do Projeto 
- Integração real com Gmail API (OAuth + refresh token).
- Backend serverless usando Supabase Edge Functions.
- Arquitetura limpa: View → ViewModel → Services → Model → State.
- Dashboard completo: métricas, gráficos, top destinatários.
- Tratamento de erros, loading states, EmptyStates e toasts.
- Todo fluxo ponta-a-ponta funcionando (sem mock).

### ⚠️ Por que este repositório NÃO roda ao simplesmente clonar
- Por segurança:
- Nenhuma chave privada está neste repo.
- Gmail API exige configuração OAuth pessoal.
- Supabase precisa de um projeto próprio, tabelas e Edge Functions implantadas.

- Você precisará configurar:
- ✔ Seu próprio Supabase (Postgres + Edge Functions)
- ✔ Seu Google Cloud com Gmail API habilitada
- ✔ Suas credenciais (client id/secret + refresh token)
- ✔ Variáveis de ambiente no Supabase e no `.env.local`

- Sem isso, o frontend sobe, mas não conecta ao banco nem às funções serverless.

## 🗂 Estrutura de Pastas

```
src/
  view/
    pages/          # Telas: Dashboard, Pendentes, Lista, CadastroManual, Detalhes
    components/     # UI reutilizável (Sidebar, Layout, Cards, Tabelas, Skeleton, Toast)
  viewmodel/
    dashboard/      # Hooks do dashboard (useDashboard)
    emails/         # Hooks para listar, filtrar, classificar e cadastrar
  model/
    email.ts        # Tipos de Email + DTOs
    dashboard.ts    # Tipos para métricas e gráficos
  state/
    emails.tsx      # Contexto global de e-mails
    toast.tsx       # Contexto global de toasts
  services/
    supabase.ts     # Cliente Supabase
    emailService.ts # CRUD e classificação
    dashboardService.ts
    ibgeService.ts
  utils/
    csv.ts          # Exportação CSV

supabase/
  functions/
    gmail-poll/     # Busca e-mails no Gmail e salva no DB
    ingest-email/   # Recebe e-mails via webhook
  migrations/
    schema.sql      # Estrutura do banco (DDL)

.github/
  workflows/
    gmail-poll.yml  # (Opcional) Cron do GitHub para polling
```

## 🏗 Arquitetura (Camadas + MVVM leve)
- View (React JSX)
- ↓ usa hooks
- ViewModel (hooks TS)
- ↓ chama
- Services (regras + acesso a dados)
- ↓ usa
- Model (tipos)
- State (contextos globais)

### ✔ Benefícios
- Separação clara de responsabilidades
- Fácil de evoluir e testar
- Services independentes do React
- Hooks limpos e focados na tela

## 🛠 Tecnologias

### Frontend
- React + TypeScript + Vite
- TailwindCSS
- `react-router-dom`
- `react-chartjs-2` + `chart.js`

### Backend (Serverless)
- Supabase Postgres
- Supabase Edge Functions (Deno runtime)
- Supabase Auth e RLS

### Automação
- Cron externo ou GitHub Actions chamando `gmail-poll`

## 📡 Backend: Supabase + Gmail API

### 🔵 Banco de Dados

- Tabela `emails`:
- `remetente`
- `destinatario`
- `assunto`
- `corpo`
- `dataHora`
- `uf` / `municipio`
- `uf_sigla` / `municipio_id` (normalizados)
- `classificado` (boolean)

- Tabela `municipios`:
- `nome`
- `uf_sigla`

### 🟣 Edge Function: gmail-poll
- Responsável por:
- Renovar o token OAuth via Google
- Buscar novas mensagens com filtros (`GMAIL_QUERY`)
- Extrair headers: `From`, `To`, `Subject`, `Date`
- Inserir no banco com `classificado = false`

- Fluxo típico:
- Cron job → `gmail-poll` → Postgres → Frontend

### 🟠 Edge Function: ingest-email
- Recebe e-mail de outros provedores por webhook.
- Útil para integrações futuras além do Gmail.

## 📊 Fluxos principais

### 📌 Dashboard
- Totais, classificados, pendentes
- Agrupamento por UF
- Tendência 7 dias
- Gráficos com `chart.js`
- Carregado via `useDashboard`

### 📌 Pendentes
- Lista de e-mails não classificados
- Filtro por remetente e data
- Paginação
- Classificação usando dados do IBGE

### 📌 Lista Geral
- Histórico completo
- Filtros, paginação, busca
- EmptyState quando não há resultados

### 📌 Cadastro Manual
- Formulário completo
- Busca UF/município pela API do IBGE
- Envio com toasts de sucesso/erro

### 📌 Detalhes
- Visualizar e editar dados de um e-mail específico

## 🧪 Testabilidade
- A arquitetura facilita:
- Testes unitários de services (sem React)
- Testes de hooks com mocks de services
- Testes de fluxo de dados do dashboard

## 🔐 Segurança

- No frontend:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (pode ser pública com RLS)

- Somente no Supabase:
- `SUPABASE_SERVICE_ROLE_KEY`
- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `GMAIL_REFRESH_TOKEN`

- Nenhuma chave sensível está neste repositório.

## 🖼 Espaço para Screenshots das Telas
- 📸 Dashboard
  <img width="1919" height="950" alt="image" src="https://github.com/user-attachments/assets/da845f7c-184a-4487-93c7-df189d933f19" />

- 📸 Pendentes
  <img width="1906" height="942" alt="image" src="https://github.com/user-attachments/assets/7ba075a7-6099-41c5-abd7-37846e630ae0" />
  
- 📸 Cadastro Manual
  <img width="1900" height="930" alt="image" src="https://github.com/user-attachments/assets/72d92290-3e85-4cff-94a5-235b5961d3a3" />

  - 📸 Lista Geral
    <img width="1897" height="952" alt="image" src="https://github.com/user-attachments/assets/c1e9d50b-adc9-49d8-b448-d8c3d469f1e0" />

