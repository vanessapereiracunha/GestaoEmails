-- Database schema for the app
create extension if not exists pgcrypto;

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
-- Optional: natural uniqueness to avoid duplicates from ingestion strategies
-- create unique index if not exists uniq_emails_natural
--   on public.emails(remetente, destinatario, coalesce(assunto, ''), dataHora);
